'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { Customer, DuePayment, PaymentMethod } from '@/types/shop';
import { translations, formatCurrency, formatDate } from '@/lib/i18n';
import {
  BookOpen,
  Search,
  Plus,
  Send,
  User,
  Phone,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { ReminderModal } from './reminder-modal';

export const DuesView: React.FC = () => {
  const {
    locale,
    customers,
    totalCustomerDues,
    duePayments,
    recordDuePayment,
    createCustomer
  } = useShop();

  const t = translations[locale];

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyWithDue, setOnlyWithDue] = useState(true);

  // Reminder Modal
  const [activeReminderCustomer, setActiveReminderCustomer] = useState<Customer | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  // Due Payment Modal
  const [payingCustomer, setPayingCustomer] = useState<Customer | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('cash');
  const [payNotes, setPayNotes] = useState('');

  // New Customer Modal
  const [isNewCustOpen, setIsNewCustOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Selected customer for history drawer/view
  const [selectedHistoryCust, setSelectedHistoryCust] = useState<Customer | null>(null);

  // Submit Due Collection
  const handlePayDue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingCustomer) return;
    const amount = Number(payAmount);
    if (!amount || amount <= 0) return;

    recordDuePayment({
      customerId: payingCustomer.id,
      amount,
      paymentMethod: payMethod,
      note: payNotes.trim() || undefined
    });

    setPayingCustomer(null);
    setPayAmount('');
    setPayNotes('');
  };

  // Submit New Customer
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) {
      alert(locale === 'bn' ? 'দয়া করে গ্রাহকের নাম ও ফোন নম্বর দিন।' : 'Please enter customer name and phone.');
      return;
    }

    createCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      address: newCustAddress.trim() || undefined
    });

    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setIsNewCustOpen(false);
  };

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDue = !onlyWithDue || c.dueBalance > 0;
    return matchesSearch && matchesDue;
  });

  // Customer payments history
  const customerPaymentHistory = selectedHistoryCust
    ? duePayments.filter((p) => p.customerId === selectedHistoryCust.id)
    : [];

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <span>{t.dues_title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {locale === 'bn'
              ? 'কাস্টমারদের কাছে মোট পাওনা বকেয়া বাকি, আদায় ও তাগাদা এসএমএস বার্তা'
              : 'Customer credit ledger, payment collection, and bilingual reminder SMS'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-lg text-right">
            <span className="text-[10px] text-purple-700 font-semibold uppercase block">
              {t.total_customer_due}
            </span>
            <span className="text-base sm:text-lg font-bold text-purple-950 font-mono tabular-nums">
              {formatCurrency(totalCustomerDues, locale)}
            </span>
          </div>

          <button
            onClick={() => setIsNewCustOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'bn' ? 'নতুন কাস্টমার' : 'Add Customer'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={locale === 'bn' ? 'নাম বা ফোন নম্বর দিয়ে খুঁজুন...' : 'Search by name or phone...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-purple-900 font-medium cursor-pointer bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
          <input
            type="checkbox"
            checked={onlyWithDue}
            onChange={(e) => setOnlyWithDue(e.target.checked)}
            className="rounded text-purple-600 focus:ring-purple-500"
          />
          <span>{locale === 'bn' ? 'শুধুমাত্র বাকি আছে এমন কাস্টমার' : 'Only with due balance'}</span>
        </label>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const hasDue = cust.dueBalance > 0;
          const isHighDue = cust.dueBalance > 2000;

          return (
            <div
              key={cust.id}
              className={`p-4 rounded-xl border bg-white flex flex-col justify-between transition-all ${
                isHighDue
                  ? 'border-red-300 bg-red-50/10'
                  : hasDue
                  ? 'border-purple-200'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      {cust.name.slice(0, 1)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">
                        {cust.name}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {cust.phone}
                      </span>
                    </div>
                  </div>

                  {isHighDue && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-red-100 text-red-700">
                      {locale === 'bn' ? 'বেশি বাকি' : 'High Due'}
                    </span>
                  )}
                </div>

                {cust.address && (
                  <p className="text-[11px] text-slate-500 truncate mb-3">
                    {cust.address}
                  </p>
                )}

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    {locale === 'bn' ? 'বর্তমান বাকি ব্যালেন্স:' : 'Due Balance:'}
                  </span>
                  <span
                    className={`font-mono font-bold text-sm tabular-nums ${
                      hasDue ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {formatCurrency(cust.dueBalance, locale)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5 text-xs">
                {hasDue && (
                  <button
                    onClick={() => {
                      setActiveReminderCustomer(cust);
                      setIsReminderOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <Send className="w-3.5 h-3.5 text-purple-600" />
                    <span>{t.send_reminder}</span>
                  </button>
                )}

                {hasDue && (
                  <button
                    onClick={() => {
                      setPayingCustomer(cust);
                      setPayAmount(String(cust.dueBalance));
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.collect_due}</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedHistoryCust(cust)}
                  className="px-2 py-1.5 text-slate-500 hover:text-slate-800 underline text-[11px]"
                >
                  {locale === 'bn' ? 'খতিয়ান' : 'Ledger'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-medium">
            {locale === 'bn' ? 'কোনো কাস্টমার বা বাকি হিসাব পাওয়া যায়নি' : 'No customer dues found'}
          </p>
        </div>
      )}

      {/* Collect Due Payment Modal */}
      {payingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="collect-due-title"
            className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 id="collect-due-title" className="text-sm font-bold text-slate-900">
                {t.collect_due}: {payingCustomer.name}
              </h3>
              <button
                onClick={() => setPayingCustomer(null)}
                aria-label="Close modal"
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePayDue} className="p-4 space-y-3 text-xs">
              <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-200 flex justify-between">
                <span className="text-purple-900">{locale === 'bn' ? 'মোট বকেয়া বাকি:' : 'Total Due:'}</span>
                <span className="font-bold text-red-600 font-mono text-sm">
                  {formatCurrency(payingCustomer.dueBalance, locale)}
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'আদায়ের পরিমাণ (৳)' : 'Payment Amount (৳)'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={payingCustomer.dueBalance}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t.payment_method}
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="cash">{t.cash}</option>
                  <option value="bkash">{t.bkash}</option>
                  <option value="nagad">{t.nagad}</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'মন্তব্য (ঐচ্ছিক)' : 'Note (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="বাকি আংশিক পরিশোধ"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayingCustomer(null)}
                  className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  {locale === 'bn' ? 'জমা সংরক্ষণ করুন' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Customer Modal */}
      {isNewCustOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-cust-title"
            className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 id="new-cust-title" className="text-sm font-bold text-slate-900">
                {locale === 'bn' ? 'নতুন কাস্টমার যোগ' : 'Add Customer'}
              </h3>
              <button
                onClick={() => setIsNewCustOpen(false)}
                aria-label="Close modal"
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t.customer_name} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="মোঃ মোজাম্মেল হক"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t.customer_phone} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XX-XXXXXX"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'ঠিকানা (এলাকা / গ্রাম)' : 'Address'}
                </label>
                <input
                  type="text"
                  placeholder="দক্ষিণ পাড়া, মিরপুর"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCustOpen(false)}
                  className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  {t.save_settings}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Ledger History Modal */}
      {selectedHistoryCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-ledger-title"
            className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 id="customer-ledger-title" className="text-sm font-bold text-slate-900">
                  {locale === 'bn' ? 'বাকি ও আদায় খতিয়ান' : 'Due Ledger'}: {selectedHistoryCust.name}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">{selectedHistoryCust.phone}</span>
              </div>
              <button
                onClick={() => setSelectedHistoryCust(null)}
                aria-label="Close modal"
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-100 font-bold">
                <span>{locale === 'bn' ? 'বর্তমান বকেয়া বাকি:' : 'Current Due:'}</span>
                <span className="text-red-600 font-mono text-sm">
                  {formatCurrency(selectedHistoryCust.dueBalance, locale)}
                </span>
              </div>

              <div className="divide-y divide-slate-100 pt-2">
                {customerPaymentHistory.map((p) => (
                  <div key={p.id} className="py-2 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{locale === 'bn' ? 'বাকি আদায় জমা' : 'Due Collected'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatDate(p.createdAt, locale, true)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-emerald-700 font-mono tabular-nums">
                        -{formatCurrency(p.amount, locale)}
                      </span>
                      <span className="text-[10px] text-slate-500 block uppercase">
                        {p.paymentMethod}
                      </span>
                    </div>
                  </div>
                ))}

                {customerPaymentHistory.length === 0 && (
                  <div className="py-6 text-center text-slate-400">
                    {locale === 'bn' ? 'কোনো পূর্ববর্তী পেমেন্ট এন্ট্রি নেই' : 'No prior payment entries'}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedHistoryCust(null)}
                className="px-3.5 py-1.5 rounded-md bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS Reminder Modal */}
      <ReminderModal
        customer={activeReminderCustomer}
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
      />
    </div>
  );
};
