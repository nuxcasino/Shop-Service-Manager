'use client';

import React from 'react';
import { useShop } from '@/context/shop-context';
import { translations, formatCurrency, formatDate } from '@/lib/i18n';
import {
  TrendingUp,
  Wrench,
  Smartphone,
  Receipt,
  Wallet,
  AlertTriangle,
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  PlusCircle,
  ShoppingCart,
  CheckCircle2
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
  onOpenQuickAction: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenQuickAction
}) => {
  const {
    locale,
    role,
    business,
    todaySalesTotal,
    todayServiceIncome,
    todayBankingCommission,
    todayExpensesTotal,
    totalCustomerDues,
    activeServiceJobsCount,
    lowStockProducts,
    currentCashInDrawer,
    sales,
    serviceJobs,
    mobileBankingTx
  } = useShop();

  const t = translations[locale];

  // Combined recent activities
  const recentActivities = [
    ...sales.slice(0, 4).map((s) => ({
      id: s.id,
      title: `${locale === 'bn' ? 'পণ্য বিক্রয়' : 'Product Sale'}: ${s.invoiceNo}`,
      subtitle: `${s.customerName} · ${s.items.length} ${locale === 'bn' ? 'আইটেম' : 'items'}`,
      amount: s.totalAmount,
      type: 'sale' as const,
      date: s.createdAt
    })),
    ...serviceJobs.slice(0, 3).map((j) => ({
      id: j.id,
      title: `${locale === 'bn' ? 'সার্ভিস টিকিট' : 'Service Ticket'}: ${j.ticketNo}`,
      subtitle: `${j.customerName} · ${j.deviceBrand} ${j.deviceModel} (${j.serviceType})`,
      amount: j.finalCost || j.estimatedCost,
      type: 'service' as const,
      date: j.receivedDate
    })),
    ...mobileBankingTx.slice(0, 3).map((m) => ({
      id: m.id,
      title: `${m.provider.toUpperCase()} ${m.type === 'cash_in' ? 'Cash In' : 'Cash Out'}`,
      subtitle: `${m.customerPhone} · ${locale === 'bn' ? 'কমিশন' : 'Comm.'} ${formatCurrency(m.commission, locale)}`,
      amount: m.amount,
      type: 'mfs' as const,
      date: m.createdAt
    }))
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-5 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {locale === 'bn' ? business.nameBn : business.nameEn}
          </h1>
          <p suppressHydrationWarning className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {locale === 'bn'
              ? `স্বাগতম! আজকের তারিখ: ${formatDate(new Date(), 'bn', false)}`
              : `Welcome! Today is ${formatDate(new Date(), 'en', false)}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pos')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t.quick_new_sale}</span>
          </button>
          <button
            onClick={onOpenQuickAction}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 text-slate-600" />
            <span>{t.quick_actions}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (60-30-10 discipline) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Today's Sales */}
        <div 
          onClick={() => setActiveTab('pos')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{t.today_sales}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div suppressHydrationWarning className="text-lg sm:text-xl font-bold text-slate-900 font-mono tabular-nums">
            {formatCurrency(todaySalesTotal, locale)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>{locale === 'bn' ? 'বিক্রয় সম্পন্ন' : 'Sales today'}</span>
          </div>
        </div>

        {/* Today's Service Income */}
        <div 
          onClick={() => setActiveTab('service')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{t.today_service_income}</span>
            <Wrench className="w-4 h-4 text-blue-600" />
          </div>
          <div suppressHydrationWarning className="text-lg sm:text-xl font-bold text-slate-900 font-mono tabular-nums">
            {formatCurrency(todayServiceIncome, locale)}
          </div>
          <div className="text-[11px] text-blue-700 mt-1 flex items-center gap-1">
            <span>{activeServiceJobsCount} {locale === 'bn' ? 'টি মেরামত চলছে' : 'jobs ongoing'}</span>
          </div>
        </div>

        {/* Banking Commission */}
        <div 
          onClick={() => setActiveTab('banking')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-pink-500 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{t.today_banking_commission}</span>
            <Smartphone className="w-4 h-4 text-pink-600" />
          </div>
          <div suppressHydrationWarning className="text-lg sm:text-xl font-bold text-slate-900 font-mono tabular-nums">
            {formatCurrency(todayBankingCommission, locale)}
          </div>
          <div className="text-[11px] text-pink-700 mt-1 flex items-center gap-1">
            <span>{locale === 'bn' ? 'বিকাশ ও নগদ লাভ' : 'MFS & Flexi profit'}</span>
          </div>
        </div>

        {/* Today's Expenses */}
        <div 
          onClick={() => setActiveTab('expenses')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-500 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{t.today_expenses}</span>
            <Receipt className="w-4 h-4 text-amber-600" />
          </div>
          <div suppressHydrationWarning className="text-lg sm:text-xl font-bold text-slate-900 font-mono tabular-nums">
            {formatCurrency(todayExpensesTotal, locale)}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
            <ArrowDownLeft className="w-3 h-3" />
            <span>{locale === 'bn' ? 'দোকান ব্যয়' : 'Shop expenses'}</span>
          </div>
        </div>

        {/* Net Cash Drawer Position */}
        <div className="col-span-2 sm:col-span-2 lg:col-span-1 p-3.5 sm:p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{t.cash_in_drawer}</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div suppressHydrationWarning className="text-lg sm:text-xl font-bold text-emerald-400 font-mono tabular-nums">
            {formatCurrency(currentCashInDrawer, locale)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {locale === 'bn' ? 'ক্যাশ ড্রয়ারে থাকা ক্যাশ' : 'Estimated in drawer'}
          </div>
        </div>
      </div>

      {/* Operational Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Customer Dues Card */}
        <div 
          onClick={() => setActiveTab('dues')}
          className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 hover:border-purple-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-purple-900 mb-2">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-700" />
              <span>{t.total_customer_due}</span>
            </span>
            <span className="text-[11px] bg-purple-200/70 text-purple-900 px-2 py-0.5 rounded-full font-bold">
              {locale === 'bn' ? 'বাকি খাতা' : 'Khata'}
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-950 font-mono tabular-nums">
            {formatCurrency(totalCustomerDues, locale)}
          </div>
          <p className="text-xs text-purple-800 mt-1">
            {locale === 'bn'
              ? 'গ্রাহকদের কাছে পাওনা মোট বাকি টাকা। ক্লিক করে তাগাদা SMS পাঠান।'
              : 'Total outstanding customer credit. Click to send reminders.'}
          </p>
        </div>

        {/* Ongoing Service Jobs Card */}
        <div 
          onClick={() => setActiveTab('service')}
          className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-blue-900 mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>{t.pending_jobs}</span>
            </span>
            <span className="text-[11px] bg-blue-200/70 text-blue-900 px-2 py-0.5 rounded-full font-bold">
              {activeServiceJobsCount} {locale === 'bn' ? 'টি' : 'jobs'}
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-950 font-mono tabular-nums">
            {activeServiceJobsCount}
          </div>
          <p className="text-xs text-blue-800 mt-1">
            {locale === 'bn'
              ? 'মেরামতের অপেক্ষায় অথবা ডেলিভারির জন্য প্রস্তুত ডিভাইস।'
              : 'Repair tickets currently in progress or waiting delivery.'}
          </p>
        </div>

        {/* Low Stock Warning Card */}
        <div 
          onClick={() => setActiveTab('inventory')}
          className={`p-4 rounded-xl border transition-colors cursor-pointer ${
            lowStockProducts.length > 0
              ? 'bg-amber-50/60 border-amber-300 hover:border-amber-400'
              : 'bg-emerald-50/60 border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-2">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>{t.low_stock_items}</span>
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                lowStockProducts.length > 0
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-emerald-200 text-emerald-900'
              }`}
            >
              {lowStockProducts.length} {locale === 'bn' ? 'টি পণ্য' : 'items'}
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-950 font-mono tabular-nums">
            {lowStockProducts.length}
          </div>
          <p className="text-xs text-amber-800 mt-1">
            {lowStockProducts.length > 0
              ? (locale === 'bn' ? 'স্টক দ্রুত ফুরিয়ে যাচ্ছে, নতুন অর্ডার প্রয়োজন।' : 'Items below threshold. Restock recommended.')
              : (locale === 'bn' ? 'সকল পণ্যের পর্যাপ্ত স্টক রয়েছে।' : 'All product stock levels are healthy.')}
          </p>
        </div>
      </div>

      {/* Main Content Row: Cash Flow Reconciliation & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cash Flow Reconciliation Summary */}
        <div className="lg:col-span-1 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">{t.cash_flow_title}</h2>
            <span className="text-[11px] text-slate-500 font-mono">
              {formatDate(new Date(), locale, false)}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>{locale === 'bn' ? '(+) নগদ পণ্য বিক্রয় জমা' : '(+) Cash Product Sales'}</span>
              <span className="font-semibold text-emerald-700 font-mono tabular-nums">
                +{formatCurrency(todaySalesTotal, locale)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>{locale === 'bn' ? '(+) সার্ভিসিং নগদ আয়' : '(+) Service Cash Income'}</span>
              <span className="font-semibold text-emerald-700 font-mono tabular-nums">
                +{formatCurrency(todayServiceIncome, locale)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>{locale === 'bn' ? '(+) মোবাইল ব্যাংকিং কমিশন' : '(+) Banking Commissions'}</span>
              <span className="font-semibold text-emerald-700 font-mono tabular-nums">
                +{formatCurrency(todayBankingCommission, locale)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600 border-b border-slate-100 pb-2">
              <span>{locale === 'bn' ? '(-) আজকের দোকান খরচ' : '(-) Daily Shop Expenses'}</span>
              <span className="font-semibold text-red-600 font-mono tabular-nums">
                -{formatCurrency(todayExpensesTotal, locale)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 text-sm font-bold text-slate-900">
              <span>{locale === 'bn' ? 'আজকের নেট নগদ উদ্বৃত্ত' : 'Net Daily Cash Balance'}</span>
              <span className="text-emerald-700 font-mono tabular-nums">
                {formatCurrency(todaySalesTotal + todayServiceIncome + todayBankingCommission - todayExpensesTotal, locale)}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('reports')}
              className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
            >
              {locale === 'bn' ? 'পূর্ণাঙ্গ হিসাব ও রিপোর্ট দেখুন →' : 'View Full Reports & Cashflow →'}
            </button>
          </div>
        </div>

        {/* Recent Transactions Feed */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">{t.recent_activities}</h2>
            <button
              onClick={() => setActiveTab('pos')}
              className="text-xs text-emerald-700 hover:underline font-medium"
            >
              {locale === 'bn' ? 'সকল লেনদেন' : 'View all'}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      act.type === 'sale'
                        ? 'bg-emerald-100 text-emerald-800'
                        : act.type === 'service'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-pink-100 text-pink-800'
                    }`}
                  >
                    {act.type === 'sale' ? (
                      <ShoppingCart className="w-4 h-4" />
                    ) : act.type === 'service' ? (
                      <Wrench className="w-4 h-4" />
                    ) : (
                      <Smartphone className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 leading-snug">
                      {act.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {act.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 font-mono tabular-nums block">
                    {formatCurrency(act.amount, locale)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDate(act.date, locale, true)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
