'use client';

import React, { useState } from 'react';
import { Sale, Locale } from '@/types/shop';
import { useShop } from '@/context/shop-context';
import { translations, formatCurrency, formatDate } from '@/lib/i18n';
import { Printer, X, Languages, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  sale,
  isOpen,
  onClose
}) => {
  const { business, locale: defaultLocale } = useShop();
  const [printLocale, setPrintLocale] = useState<Locale>(defaultLocale);
  const [printMode, setPrintMode] = useState<'thermal' | 'standard'>('thermal');

  if (!isOpen || !sale) return null;

  const t = translations[printLocale];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-modal-title"
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Controls Header - Hidden during browser print */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 id="invoice-modal-title" className="text-sm font-semibold">
              {printLocale === 'bn' ? 'ক্যাশ মেমো / ইনভয়েস' : 'Cash Memo / Invoice'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle: Thermal vs Standard */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 text-xs">
              <button
                onClick={() => setPrintMode('thermal')}
                className={`px-2 py-1 rounded transition-colors ${
                  printMode === 'thermal'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {printLocale === 'bn' ? 'থার্মাল (80mm)' : 'Thermal (80mm)'}
              </button>
              <button
                onClick={() => setPrintMode('standard')}
                className={`px-2 py-1 rounded transition-colors ${
                  printMode === 'standard'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {printLocale === 'bn' ? 'স্ট্যান্ডার্ড' : 'Standard'}
              </button>
            </div>

            {/* Language toggle at print time */}
            <button
              onClick={() => setPrintLocale(printLocale === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{printLocale === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-100 flex justify-center">
          <div
            id="printable-invoice"
            className={`bg-white border border-slate-300 shadow-sm p-4 sm:p-5 text-slate-900 transition-all ${
              printMode === 'thermal'
                ? 'w-full max-w-[340px] text-xs font-mono'
                : 'w-full max-w-[480px] text-sm'
            }`}
          >
            {/* Shop Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <h1 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-900">
                {printLocale === 'bn' ? business.nameBn : business.nameEn}
              </h1>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                {business.address}, {business.district}
              </p>
              <p className="text-[11px] font-semibold text-slate-700">
                {printLocale === 'bn' ? 'মোবাইল: ' : 'Phone: '}
                {business.phone}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 italic">
                {printLocale === 'bn' ? business.taglineBn : business.taglineEn}
              </p>
            </div>

            {/* Memo & Customer Metadata */}
            <div className="py-2.5 border-b border-dashed border-slate-300 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">{printLocale === 'bn' ? 'মেমো নং:' : 'Invoice No:'}</span>
                <span className="font-bold">{sale.invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{printLocale === 'bn' ? 'তারিখ:' : 'Date:'}</span>
                <span>{formatDate(sale.createdAt, printLocale, true)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{printLocale === 'bn' ? 'গ্রাহক:' : 'Customer:'}</span>
                <span className="font-semibold">{sale.customerName || (printLocale === 'bn' ? 'নগদ ক্রেতা' : 'Walk-in Customer')}</span>
              </div>
              {sale.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">{printLocale === 'bn' ? 'মোবাইল:' : 'Phone:'}</span>
                  <span>{sale.customerPhone}</span>
                </div>
              )}
            </div>

            {/* Itemized Table */}
            <div className="py-2 border-b border-dashed border-slate-300">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="text-left pb-1 font-semibold">{printLocale === 'bn' ? 'বিবরণ' : 'Item'}</th>
                    <th className="text-center pb-1 font-semibold w-10">{printLocale === 'bn' ? 'পরি.' : 'Qty'}</th>
                    <th className="text-right pb-1 font-semibold w-14">{printLocale === 'bn' ? 'দর' : 'Rate'}</th>
                    <th className="text-right pb-1 font-semibold w-16">{printLocale === 'bn' ? 'মোট' : 'Total'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sale.items.map((item, idx) => (
                    <tr key={idx} className="py-1">
                      <td className="py-1 text-left font-medium leading-tight">
                        {printLocale === 'bn' ? item.nameBn : item.nameEn}
                      </td>
                      <td className="py-1 text-center tabular-nums">{item.qty}</td>
                      <td className="py-1 text-right tabular-nums">{formatCurrency(item.unitPrice, printLocale)}</td>
                      <td className="py-1 text-right font-semibold tabular-nums">{formatCurrency(item.subtotal, printLocale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculation Totals */}
            <div className="py-2 border-b border-dashed border-slate-300 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>{printLocale === 'bn' ? 'মোট মূল্য (Subtotal):' : 'Subtotal:'}</span>
                <span className="tabular-nums">{formatCurrency(sale.subtotal, printLocale)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{printLocale === 'bn' ? 'ছাড় (Discount):' : 'Discount:'}</span>
                  <span className="tabular-nums">- {formatCurrency(sale.discount, printLocale)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-1 text-slate-900">
                <span>{printLocale === 'bn' ? 'সর্বমোট (Net Total):' : 'Net Total:'}</span>
                <span className="tabular-nums">{formatCurrency(sale.totalAmount, printLocale)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>
                  {printLocale === 'bn' ? 'জমা (Paid): ' : 'Paid ('}
                  {sale.paymentMethod.toUpperCase()}
                  {printLocale === 'en' ? ')' : ''}
                </span>
                <span className="font-semibold tabular-nums">{formatCurrency(sale.paidAmount, printLocale)}</span>
              </div>

              {sale.dueAmount > 0 && (
                <div className="flex justify-between text-red-600 font-bold bg-red-50 p-1 rounded-sm">
                  <span>{printLocale === 'bn' ? 'অবশিষ্ট বাকি (Due):' : 'Due Balance:'}</span>
                  <span className="tabular-nums">{formatCurrency(sale.dueAmount, printLocale)}</span>
                </div>
              )}
            </div>

            {/* Footer & Barcode Mock */}
            <div className="pt-3 text-center text-[10px] text-slate-500 space-y-1">
              <p className="font-medium text-slate-700">
                {printLocale === 'bn'
                  ? 'ধন্যবাদ! আবার আসবেন।'
                  : 'Thank you for your business! Please visit again.'}
              </p>
              <p className="text-[9px] text-slate-400">
                {printLocale === 'bn'
                  ? 'বিক্রীত মাল ৭ দিনের মধ্যে পরিবর্তনের সুযোগ আছে (শর্ত প্রযোজ্য)।'
                  : 'Sold items can be exchanged within 7 days with this memo.'}
              </p>
              <div className="pt-1 text-[8px] font-mono tracking-widest text-slate-400">
                * {sale.invoiceNo} *
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200 print:hidden">
          <div className="text-xs text-slate-500">
            {printLocale === 'bn' ? 'প্রিন্টার নির্বাচন করে প্রিন্ট দিন' : 'Select printer and proceed'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              {t.close}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{t.print_invoice}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
