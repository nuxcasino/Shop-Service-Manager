'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { 
  MobileBankingProvider, 
  MobileBankingType, 
  TelecomOperator 
} from '@/types/shop';
import { translations, formatCurrency, formatDate } from '@/lib/i18n';
import {
  Smartphone,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  CheckCircle2,
  DollarSign,
  Search,
  Wallet,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const BankingView: React.FC = () => {
  const {
    locale,
    providerBalances,
    mobileBankingTx,
    recharges,
    logMobileBankingTx,
    logRechargeTx
  } = useShop();

  const t = translations[locale];

  // Forms tab: MFS vs Recharge
  const [activeFormTab, setActiveFormTab] = useState<'mfs' | 'recharge'>('mfs');

  // MFS Form State
  const [mfsProvider, setMfsProvider] = useState<MobileBankingProvider>('bkash');
  const [mfsType, setMfsType] = useState<MobileBankingType>('cash_in');
  const [mfsPhone, setMfsPhone] = useState('');
  const [mfsAmount, setMfsAmount] = useState('');
  const [mfsCommission, setMfsCommission] = useState('');
  const [mfsTxId, setMfsTxId] = useState('');
  const [mfsNotes, setMfsNotes] = useState('');

  // Recharge Form State
  const [rchOperator, setRchOperator] = useState<TelecomOperator>('gp');
  const [rchPhone, setRchPhone] = useState('');
  const [rchAmount, setRchAmount] = useState('');
  const [rchCommission, setRchCommission] = useState('');
  const [rchIsPostpaid, setRchIsPostpaid] = useState(false);

  // Search & Filter
  const [historySearch, setHistorySearch] = useState('');
  const [filterProvider, setFilterProvider] = useState<string>('all');

  // Auto-calculate suggested MFS commission when amount changes
  const handleMfsAmountChange = (val: string) => {
    setMfsAmount(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      if (mfsType === 'cash_out') {
        // Typical agent commission: ৳4.10 per 1000
        const comm = (num / 1000) * 4.10;
        setMfsCommission(comm.toFixed(2));
      } else {
        // Cash in commission: ৳4.00 per 1000
        const comm = (num / 1000) * 4.00;
        setMfsCommission(comm.toFixed(2));
      }
    } else {
      setMfsCommission('');
    }
  };

  const handleMfsTypeChange = (type: MobileBankingType) => {
    setMfsType(type);
    const num = Number(mfsAmount);
    if (!isNaN(num) && num > 0) {
      const rate = type === 'cash_out' ? 4.10 : 4.00;
      setMfsCommission(((num / 1000) * rate).toFixed(2));
    }
  };

  // Auto-calculate recharge commission: ~2.7%
  const handleRchAmountChange = (val: string) => {
    setRchAmount(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      const comm = num * 0.027; // 2.7%
      setRchCommission(comm.toFixed(2));
    } else {
      setRchCommission('');
    }
  };

  const handleMfsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(mfsAmount);
    if (!amount || amount <= 0 || !mfsPhone.trim()) {
      alert(locale === 'bn' ? 'দয়া করে সঠিক মোবাইল নম্বর এবং টাকার পরিমাণ লিখুন।' : 'Please enter valid phone and amount.');
      return;
    }

    const commission = Number(mfsCommission) || 0;

    logMobileBankingTx({
      provider: mfsProvider,
      type: mfsType,
      customerPhone: mfsPhone.trim(),
      amount,
      commission,
      txId: mfsTxId.trim() || undefined,
      note: mfsNotes.trim() || undefined
    });

    setMfsPhone('');
    setMfsAmount('');
    setMfsCommission('');
    setMfsTxId('');
    setMfsNotes('');
  };

  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(rchAmount);
    if (!amount || amount <= 0 || !rchPhone.trim()) {
      alert(locale === 'bn' ? 'দয়া করে সঠিক মোবাইল নম্বর এবং টাকার পরিমাণ লিখুন।' : 'Please enter valid phone and amount.');
      return;
    }

    const commission = Number(rchCommission) || 0;

    logRechargeTx({
      operator: rchOperator,
      phone: rchPhone.trim(),
      amount,
      commission,
      isPostpaid: rchIsPostpaid
    });

    setRchPhone('');
    setRchAmount('');
    setRchCommission('');
  };

  // Filtered transactions
  const filteredMfs = mobileBankingTx.filter((t) => {
    const matchesProvider = filterProvider === 'all' || t.provider === filterProvider;
    const matchesSearch =
      t.customerPhone.includes(historySearch) ||
      (t.txId && t.txId.toLowerCase().includes(historySearch.toLowerCase())) ||
      (t.note && t.note.toLowerCase().includes(historySearch.toLowerCase()));
    return matchesProvider && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-pink-600" />
            <span>{t.mfs_title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {locale === 'bn'
              ? 'বিকাশ, নগদ, রকেটের ক্যাশ ইন, ক্যাশ আউট ব্যালেন্স এবং কমিশন ট্র্যাকার'
              : 'bKash, Nagad, Rocket cash in/out float reconciliation and commission log'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveFormTab('mfs')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeFormTab === 'mfs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {locale === 'bn' ? 'মোবাইল ব্যাংকিং (বিকাশ/নগদ)' : 'Mobile Banking'}
          </button>
          <button
            onClick={() => setActiveFormTab('recharge')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeFormTab === 'recharge'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {locale === 'bn' ? 'ফ্লেক্সিলোড / রিচার্জ' : 'Flexiload Recharge'}
          </button>
        </div>
      </div>

      {/* Provider Float Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {providerBalances.map((pb) => {
          const isBkash = pb.provider === 'bkash';
          const isNagad = pb.provider === 'nagad';
          const isRocket = pb.provider === 'rocket';

          return (
            <div
              key={pb.provider}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                isBkash
                  ? 'bg-pink-50/50 border-pink-200'
                  : isNagad
                  ? 'bg-amber-50/50 border-amber-200'
                  : isRocket
                  ? 'bg-purple-50/50 border-purple-200'
                  : 'bg-blue-50/50 border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase mb-1">
                <span
                  className={
                    isBkash
                      ? 'text-pink-700'
                      : isNagad
                      ? 'text-amber-800'
                      : isRocket
                      ? 'text-purple-700'
                      : 'text-blue-700'
                  }
                >
                  {pb.provider === 'bkash'
                    ? 'bKash (বিকাশ)'
                    : pb.provider === 'nagad'
                    ? 'Nagad (নগদ)'
                    : pb.provider === 'rocket'
                    ? 'Rocket (রকেট)'
                    : 'Upay (উপায়)'}
                </span>
                <Wallet className="w-3.5 h-3.5 opacity-70" />
              </div>

              <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono tabular-nums">
                {formatCurrency(pb.currentBalance, locale)}
              </div>

              <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                <span>{locale === 'bn' ? 'শুরুর ব্যালেন্স:' : 'Opening:'}</span>
                <span className="font-mono tabular-nums">{formatCurrency(pb.openingBalance, locale)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Form Left, Transaction History Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form Container */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 h-fit space-y-4 shadow-xs">
          {activeFormTab === 'mfs' ? (
            <form onSubmit={handleMfsSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-pink-600" />
                  <span>{locale === 'bn' ? 'নতুন ক্যাশ ইন / ক্যাশ আউট এন্ট্রি' : 'New Banking Transaction'}</span>
                </h3>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.provider}
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {(['bkash', 'nagad', 'rocket', 'upay'] as MobileBankingProvider[]).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setMfsProvider(p)}
                      className={`py-2 rounded-lg font-bold uppercase transition-colors ${
                        mfsProvider === p
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Selection (Cash In vs Cash Out) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'লেনদেনের ধরণ' : 'Transaction Type'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleMfsTypeChange('cash_in')}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      mfsType === 'cash_in'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>{t.cash_in}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMfsTypeChange('cash_out')}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      mfsType === 'cash_out'
                        ? 'bg-pink-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{t.cash_out}</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {mfsType === 'cash_in'
                    ? (locale === 'bn' ? 'কাস্টমার দোকানে ক্যাশ দিল → আপনি বিকাশ পাঠালেন (ই-ব্যালেন্স কমবে)' : 'Customer gives cash → Agent sends float')
                    : (locale === 'bn' ? 'কাস্টমার বিকাশ পাঠাল → আপনি ক্যাশ দিলেন (ই-ব্যালেন্স বাড়বে)' : 'Customer sends float → Agent gives cash')}
                </p>
              </div>

              {/* Customer Phone */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.customer_number} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XX-XXXXXX"
                  value={mfsPhone}
                  onChange={(e) => setMfsPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-mono"
                />
              </div>

              {/* Amount and Commission */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.amount} (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 2000"
                    value={mfsAmount}
                    onChange={(e) => handleMfsAmountChange(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.commission} (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="8.20"
                    value={mfsCommission}
                    onChange={(e) => setMfsCommission(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-mono text-emerald-700 font-bold"
                  />
                </div>
              </div>

              {/* Transaction ID & Note */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {locale === 'bn' ? 'TrxID (ঐচ্ছিক)' : 'Tx ID (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="BL9X4K21P"
                    value={mfsTxId}
                    onChange={(e) => setMfsTxId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {locale === 'bn' ? 'মন্তব্য' : 'Note'}
                  </label>
                  <input
                    type="text"
                    placeholder="দোকান ক্যাশ জমা"
                    value={mfsNotes}
                    onChange={(e) => setMfsNotes(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-white text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t.submit_tx}</span>
              </button>
            </form>
          ) : (
            /* Flexiload / Recharge Form */
            <form onSubmit={handleRechargeSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{t.recharge_title}</span>
                </h3>
              </div>

              {/* Operator Picker */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.operator}
                </label>
                <div className="grid grid-cols-5 gap-1 text-[11px]">
                  {(['gp', 'banglalink', 'robi', 'airtel', 'skitto'] as TelecomOperator[]).map((op) => (
                    <button
                      type="button"
                      key={op}
                      onClick={() => setRchOperator(op)}
                      className={`py-2 rounded-lg font-bold uppercase transition-colors ${
                        rchOperator === op
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone number */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.customer_number} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XX-XXXXXX"
                  value={rchPhone}
                  onChange={(e) => setRchPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden font-mono"
                />
              </div>

              {/* Amount and Commission */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.amount} (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    required
                    placeholder="298"
                    value={rchAmount}
                    onChange={(e) => handleRchAmountChange(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.commission} (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="7.75"
                    value={rchCommission}
                    onChange={(e) => setRchCommission(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden font-mono text-emerald-700 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="postpaidCheck"
                  checked={rchIsPostpaid}
                  onChange={(e) => setRchIsPostpaid(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="postpaidCheck" className="text-xs text-slate-700 cursor-pointer">
                  {locale === 'bn' ? 'পোস্টপেইড বিল পেমেন্ট' : 'Postpaid bill payment'}
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-white text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{locale === 'bn' ? 'রিচার্জ সম্পন্ন করুন' : 'Confirm Recharge'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Transactions Table (Right) */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">{t.tx_history}</h3>

            <div className="flex items-center gap-2">
              <select
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value)}
                className="text-xs p-1.5 rounded-lg border border-slate-300 bg-slate-50"
              >
                <option value="all">{t.all}</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.search}
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="text-xs pl-7 pr-2 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden w-28 sm:w-36"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="text-left pb-2 font-semibold">{t.provider}</th>
                  <th className="text-left pb-2 font-semibold">{locale === 'bn' ? 'ধরণ' : 'Type'}</th>
                  <th className="text-left pb-2 font-semibold">{t.customer_number}</th>
                  <th className="text-right pb-2 font-semibold">{t.amount}</th>
                  <th className="text-right pb-2 font-semibold">{t.commission}</th>
                  <th className="text-right pb-2 font-semibold">{t.date}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMfs.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold uppercase">
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                          tx.provider === 'bkash'
                            ? 'bg-pink-100 text-pink-800'
                            : tx.provider === 'nagad'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {tx.provider}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                          tx.type === 'cash_in'
                            ? 'text-emerald-700'
                            : 'text-pink-700'
                        }`}
                      >
                        {tx.type === 'cash_in' ? (
                          <>
                            <ArrowDownLeft className="w-3 h-3" />
                            <span>Cash In</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-3 h-3" />
                            <span>Cash Out</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono">{tx.customerPhone}</td>
                    <td className="py-2.5 text-right font-bold text-slate-900 font-mono tabular-nums">
                      {formatCurrency(tx.amount, locale)}
                    </td>
                    <td className="py-2.5 text-right font-semibold text-emerald-700 font-mono tabular-nums">
                      +{formatCurrency(tx.commission, locale)}
                    </td>
                    <td className="py-2.5 text-right text-slate-400 font-mono text-[11px]">
                      {formatDate(tx.createdAt, locale, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredMfs.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                {locale === 'bn' ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No transactions recorded'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
