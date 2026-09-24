'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { translations, formatCurrency, formatDate } from '@/lib/i18n';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Smartphone,
  Wrench,
  Printer,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    locale,
    business,
    sales,
    serviceJobs,
    mobileBankingTx,
    onlineServices,
    expenses,
    todaySalesTotal,
    todayServiceIncome,
    todayBankingCommission,
    todayExpensesTotal,
    currentCashInDrawer,
    providerBalances
  } = useShop();

  const t = translations[locale];

  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Aggregated totals
  const totalSalesRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalServiceRevenue = serviceJobs.reduce(
    (sum, j) => sum + (j.finalCost || j.estimatedCost),
    0
  );
  const totalBankingCommission = mobileBankingTx.reduce((sum, m) => sum + m.commission, 0);
  const totalOnlineIncome = onlineServices.reduce((sum, o) => sum + o.serviceCharge, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Approximate COGS (cost of goods) ~ 65% of sales
  const estimatedCOGS = totalSalesRevenue * 0.65;
  const grossProfit = totalSalesRevenue - estimatedCOGS + totalServiceRevenue + totalBankingCommission + totalOnlineIncome;
  const netProfit = grossProfit - totalExpenses;

  // Revenue by stream breakdown percentages
  const totalGrossRevenue = totalSalesRevenue + totalServiceRevenue + totalBankingCommission + totalOnlineIncome;
  const salesPct = totalGrossRevenue > 0 ? Math.round((totalSalesRevenue / totalGrossRevenue) * 100) : 0;
  const servicePct = totalGrossRevenue > 0 ? Math.round((totalServiceRevenue / totalGrossRevenue) * 100) : 0;
  const bankingPct = totalGrossRevenue > 0 ? Math.round((totalBankingCommission / totalGrossRevenue) * 100) : 0;
  const onlinePct = totalGrossRevenue > 0 ? Math.max(0, 100 - salesPct - servicePct - bankingPct) : 0;

  // Export CSV
  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Amount (BDT)'],
      ['Total Product Sales', totalSalesRevenue],
      ['Total Servicing Income', totalServiceRevenue],
      ['Mobile Banking Commission', totalBankingCommission],
      ['Photocopy & Online Shop Fee', totalOnlineIncome],
      ['Gross Profit', grossProfit],
      ['Total Expenses', totalExpenses],
      ['Net Profit', netProfit],
      ['Current Cash in Drawer', currentCashInDrawer]
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dokan_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>{t.reports_title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {locale === 'bn'
              ? 'দৈনিক ও মাসিক লাভ-ক্ষতি, আয়-ব্যয় এবং ড্রয়ার ক্যাশ রিকনসিলিয়েশন'
              : 'End-of-day summary, Net Profit/Loss, and cash reconciliation'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                period === 'today'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {locale === 'bn' ? 'আজকের দিন' : 'Today'}
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                period === 'week'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {locale === 'bn' ? 'গত ৭ দিন' : 'Last 7 Days'}
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                period === 'month'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {locale === 'bn' ? 'চলতি মাস' : 'This Month'}
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{locale === 'bn' ? 'এক্সপোর্ট CSV' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">{locale === 'bn' ? 'মোট আয় (Gross Revenue)' : 'Gross Revenue'}</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {formatCurrency(totalGrossRevenue, locale)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {locale === 'bn' ? 'বিক্রয় + সার্ভিস + কমিশন' : 'Sales + Repairs + MFS'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">{locale === 'bn' ? 'মোট দোকান ব্যয় (Expenses)' : 'Total Expenses'}</div>
          <div className="text-xl sm:text-2xl font-bold text-red-600 font-mono tabular-nums">
            {formatCurrency(totalExpenses, locale)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {locale === 'bn' ? 'দোকান পরিচালনা খরচ' : 'Operational costs'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="text-xs text-emerald-800 font-semibold mb-1">
            {locale === 'bn' ? 'নিট লাভ (Net Profit)' : 'Net Profit (Earnings)'}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-900 font-mono tabular-nums">
            {formatCurrency(netProfit, locale)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            {locale === 'bn' ? 'সব খরচ বাদে খাঁটি লাভ' : 'After all costs & expenses'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">{t.cash_in_drawer}</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {formatCurrency(currentCashInDrawer, locale)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {locale === 'bn' ? 'ক্যাশ বাক্সে থাকা নগদ টাকা' : 'Physical drawer balance'}
          </div>
        </div>
      </div>

      {/* Revenue Streams Distribution (60-30-10 palette) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Stream Breakdown Bar */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            <span>{locale === 'bn' ? 'আয়ের খাতভিত্তিক অনুপাত' : 'Revenue by Business Stream'}</span>
          </h2>

          {/* Progress segments bar */}
          <div className="h-4 w-full rounded-full bg-slate-100 flex overflow-hidden">
            <div style={{ width: `${salesPct}%` }} className="bg-emerald-600 h-full" title="Sales" />
            <div style={{ width: `${servicePct}%` }} className="bg-blue-600 h-full" title="Service" />
            <div style={{ width: `${bankingPct}%` }} className="bg-pink-600 h-full" title="Banking" />
            <div style={{ width: `${onlinePct}%` }} className="bg-indigo-600 h-full" title="Online" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">
                  {locale === 'bn' ? 'পণ্য বিক্রয়' : 'Sales'} ({salesPct}%)
                </span>
                <span className="text-slate-500 font-mono">{formatCurrency(totalSalesRevenue, locale)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">
                  {locale === 'bn' ? 'সার্ভিসিং' : 'Servicing'} ({servicePct}%)
                </span>
                <span className="text-slate-500 font-mono">{formatCurrency(totalServiceRevenue, locale)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-600 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">
                  {locale === 'bn' ? 'ব্যাংকিং কমিশন' : 'Banking'} ({bankingPct}%)
                </span>
                <span className="text-slate-500 font-mono">{formatCurrency(totalBankingCommission, locale)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">
                  {locale === 'bn' ? 'ফটোকপি ও অনলাইন' : 'Photocopy'} ({onlinePct}%)
                </span>
                <span className="text-slate-500 font-mono">{formatCurrency(totalOnlineIncome, locale)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Closing & Cash Drawer Reconciliation */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{locale === 'bn' ? 'দিনের সমাপ্তি ক্যাশ রিকনসিলিয়েশন' : 'Daily End-of-Day Reconciliation'}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {formatDate(new Date(), locale, false)}
            </span>
          </h2>

          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-600">{locale === 'bn' ? 'শুরুর ক্যাশ ড্রয়ার ব্যালেন্স' : 'Starting Drawer Cash'}</span>
              <span className="font-mono tabular-nums font-semibold text-slate-800">৳2,000.00</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-600">{locale === 'bn' ? '(+) আজকের মোট নগদ বিক্রয় ও সার্ভিস' : '(+) Cash Sales & Repairs'}</span>
              <span className="font-mono tabular-nums font-semibold text-emerald-700">+{formatCurrency(todaySalesTotal + todayServiceIncome, locale)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-600">{locale === 'bn' ? '(+) মোবাইল ব্যাংকিং কমিশন আয়' : '(+) MFS Commissions'}</span>
              <span className="font-mono tabular-nums font-semibold text-emerald-700">+{formatCurrency(todayBankingCommission, locale)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-600">{locale === 'bn' ? '(-) আজকের মোট দোকান পরিচালনা ব্যয়' : '(-) Total Shop Expenses'}</span>
              <span className="font-mono tabular-nums font-semibold text-red-600">-{formatCurrency(todayExpensesTotal, locale)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 font-bold text-sm text-slate-900">
              <span>{locale === 'bn' ? 'প্রত্যাশিত সমাপনী ক্যাশ (Closing Cash)' : 'Expected Cash in Drawer'}</span>
              <span className="font-mono tabular-nums text-emerald-700">{formatCurrency(currentCashInDrawer, locale)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Floats Closing Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-pink-600" />
          <span>{locale === 'bn' ? 'মোবাইল ব্যাংকিং ই-ব্যালেন্স ক্লোজিং' : 'MFS E-Balance Closing Summary'}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {providerBalances.map((pb) => (
            <div key={pb.provider} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-slate-900 uppercase block">
                {pb.provider}
              </span>
              <div className="text-base font-bold text-slate-900 font-mono mt-1">
                {formatCurrency(pb.currentBalance, locale)}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {locale === 'bn' ? 'শুরুতে ছিল: ' : 'Opening: '}
                {formatCurrency(pb.openingBalance, locale)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
