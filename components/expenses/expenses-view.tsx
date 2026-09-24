'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { Expense, ExpenseCategory, PaymentMethod } from '@/types/shop';
import { translations, formatCurrency, formatDate } from '@/lib/i18n';
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  Coffee,
  Zap,
  Home,
  Users,
  Car,
  FileText,
  Wifi,
  MoreHorizontal
} from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const {
    locale,
    expenses,
    todayExpensesTotal,
    logExpense
  } = useShop();

  const t = translations[locale];

  // Modals & form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>('tea_snacks');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [note, setNote] = useState('');

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');

  const categoryIcons: Record<ExpenseCategory, any> = {
    rent: Home,
    electricity: Zap,
    salary: Users,
    tea_snacks: Coffee,
    transport: Car,
    tools: FileText,
    consumables: FileText,
    internet: Wifi,
    misc: MoreHorizontal
  };

  const categoryNames: Record<ExpenseCategory, { bn: string; en: string }> = {
    rent: { bn: 'দোকান ভাড়া (Rent)', en: 'Shop Rent' },
    electricity: { bn: 'বিদ্যুৎ বিল (Electricity)', en: 'Electricity' },
    salary: { bn: 'স্টাফ বেতন (Staff Salary)', en: 'Staff Salary' },
    tea_snacks: { bn: 'চা ও আপ্যায়ন (Tea & Snacks)', en: 'Tea & Snacks' },
    transport: { bn: 'যাতায়াত / পরিবহন (Transport)', en: 'Transport' },
    tools: { bn: 'মেরামত যন্ত্রপাতি (Tools)', en: 'Tools & Equipment' },
    consumables: { bn: 'কাগজ ও স্টেশনারি (Paper/Ink)', en: 'Consumables & Ink' },
    internet: { bn: 'ইন্টারনেট ও ওয়াইফাই (Internet)', en: 'Internet & Wi-Fi' },
    misc: { bn: 'অন্যান্য খরচ (Misc)', en: 'Miscellaneous' }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) return;

    logExpense({
      category,
      amount: num,
      paymentMethod,
      note: note.trim() || undefined
    });

    setAmount('');
    setNote('');
    setIsAddOpen(false);
  };

  // Monthly expense calculation
  const totalAllExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = expenses.filter((e) => {
    const matchesCat = filterCat === 'all' || e.category === filterCat;
    const matchesSearch =
      (e.note && e.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      categoryNames[e.category].bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryNames[e.category].en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-amber-600" />
            <span>{t.expenses_title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {locale === 'bn'
              ? 'দোকান ভাড়া, বিদ্যুৎ বিল, চা-নাস্তা ও যাবতীয় ব্যয়ের খতিয়ান'
              : 'Shop rent, utilities, tea & snacks, and operational expenses ledger'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-lg text-right">
            <span className="text-[10px] text-amber-700 font-semibold uppercase block">
              {t.today_expenses}
            </span>
            <span className="text-base sm:text-lg font-bold text-amber-950 font-mono tabular-nums">
              {formatCurrency(todayExpensesTotal, locale)}
            </span>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{t.add_expense}</span>
          </button>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
            />
          </div>

          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-medium"
          >
            <option value="all">{t.all_categories}</option>
            {Object.entries(categoryNames).map(([key, val]) => (
              <option key={key} value={key}>
                {locale === 'bn' ? val.bn : val.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">{t.category}</th>
                <th className="text-left py-3 px-3 font-semibold">{locale === 'bn' ? 'বিবরণ ও মন্তব্য' : 'Description / Note'}</th>
                <th className="text-center py-3 px-3 font-semibold">{t.payment_method}</th>
                <th className="text-right py-3 px-3 font-semibold">{t.amount}</th>
                <th className="text-right py-3 px-4 font-semibold">{t.date}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => {
                const Icon = categoryIcons[exp.category] || MoreHorizontal;
                const catName = categoryNames[exp.category] || { bn: exp.category, en: exp.category };

                return (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-slate-900">
                          {locale === 'bn' ? catName.bn : catName.en}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      {exp.note || <span className="text-slate-300 italic">—</span>}
                    </td>

                    <td className="py-3 px-3 text-center uppercase font-mono text-[10px] text-slate-500">
                      <span className="px-1.5 py-0.5 rounded-sm bg-slate-100">
                        {exp.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-red-600 font-mono text-sm tabular-nums">
                      -{formatCurrency(exp.amount, locale)}
                    </td>

                    <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                      {formatDate(exp.createdAt, locale, true)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredExpenses.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              {locale === 'bn' ? 'কোনো খরচ পাওয়া যায়নি' : 'No expenses recorded'}
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-expense-title"
            className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 id="add-expense-title" className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-amber-600" />
                <span>{t.add_expense}</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                aria-label="Close modal"
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t.category}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  {Object.entries(categoryNames).map(([key, val]) => (
                    <option key={key} value={key}>
                      {locale === 'bn' ? val.bn : val.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t.amount} (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 150"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'টাকা কোথা থেকে খরচ হলো?' : 'Paid From'}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="cash">{locale === 'bn' ? 'দোকানের ক্যাশ ড্রয়ার (Cash in Drawer)' : 'Cash in Drawer'}</option>
                  <option value="bkash">{locale === 'bn' ? 'বিকাশ (bKash Agent/Personal)' : 'bKash'}</option>
                  <option value="nagad">{locale === 'bn' ? 'নগদ (Nagad)' : 'Nagad'}</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'মন্তব্য / বিবরণ' : 'Description / Note'}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: দুপুরের চা ও বিস্কুট"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  {t.save_settings}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
