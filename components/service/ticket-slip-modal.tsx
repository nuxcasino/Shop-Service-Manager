'use client';

import React, { useState } from 'react';
import { ServiceJob, Locale } from '@/types/shop';
import { useShop } from '@/context/shop-context';
import { translations, formatCurrency, formatDate } from '@/lib/i18n';
import { Printer, X, Languages, Shield, Clock } from 'lucide-react';

interface TicketSlipModalProps {
  job: ServiceJob | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketSlipModal: React.FC<TicketSlipModalProps> = ({
  job,
  isOpen,
  onClose
}) => {
  const { business, locale: defaultLocale } = useShop();
  const [printLocale, setPrintLocale] = useState<Locale>(defaultLocale);

  if (!isOpen || !job) return null;

  const t = translations[printLocale];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-slip-title"
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <h2 id="ticket-slip-title" className="text-sm font-semibold">
              {printLocale === 'bn' ? 'মোবাইল সার্ভিসিং রিসিট ও টোকেন' : 'Mobile Service Job Slip'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrintLocale(printLocale === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{printLocale === 'bn' ? 'English' : 'বাংলা'}</span>
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

        {/* Printable Voucher */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-100 flex justify-center">
          <div
            id="printable-slip"
            className="w-full max-w-[420px] bg-white border border-slate-300 shadow-sm p-4 sm:p-5 text-slate-900 text-xs font-mono"
          >
            {/* Header */}
            <div className="text-center pb-3 border-b-2 border-slate-900">
              <h1 className="text-base font-bold uppercase tracking-tight text-slate-900">
                {printLocale === 'bn' ? business.nameBn : business.nameEn}
              </h1>
              <p className="text-[11px] text-slate-600 leading-snug">
                {business.address}, {business.district}
              </p>
              <p className="text-[11px] font-bold text-slate-800">
                {printLocale === 'bn' ? 'হেল্পলাইন: ' : 'Helpline: '} {business.phone}
              </p>
              <div className="mt-2 inline-block px-3 py-0.5 bg-slate-900 text-white text-[11px] font-bold rounded-sm">
                {printLocale === 'bn' ? 'সার্ভিস গ্রহণ রিসিট (গ্রাহক কপি)' : 'SERVICE REPAIR SLIP (CUSTOMER COPY)'}
              </div>
            </div>

            {/* Ticket Info */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{printLocale === 'bn' ? 'টিকেট নম্বর:' : 'Ticket #:'}</span>
                <span className="text-sm text-blue-700">{job.ticketNo}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{printLocale === 'bn' ? 'জমার তারিখ:' : 'Received Date:'}</span>
                <span>{formatDate(job.receivedDate, printLocale, true)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{printLocale === 'bn' ? 'গ্রাহকের নাম:' : 'Customer Name:'}</span>
                <span className="font-semibold text-slate-900">{job.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{printLocale === 'bn' ? 'মোবাইল নম্বর:' : 'Phone:'}</span>
                <span className="font-semibold text-slate-900">{job.customerPhone}</span>
              </div>
            </div>

            {/* Device & Problem Details */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">{printLocale === 'bn' ? 'ডিভাইস ব্র্যান্ড ও মডেল:' : 'Device & Model:'}</span>
                <span className="font-bold text-slate-900">{job.deviceBrand} {job.deviceModel}</span>
              </div>
              {job.imei && (
                <div className="flex justify-between">
                  <span className="text-slate-500">{printLocale === 'bn' ? 'IMEI / সিরিয়াল:' : 'IMEI / Serial:'}</span>
                  <span className="font-mono text-slate-700">{job.imei}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">{printLocale === 'bn' ? 'কাজের ধরণ:' : 'Service Type:'}</span>
                <span className="font-semibold text-slate-900">{job.serviceType}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block">{printLocale === 'bn' ? 'সমস্যার বিবরণ:' : 'Problem Reported:'}</span>
                <p className="text-slate-800 bg-slate-50 p-1.5 rounded-sm mt-0.5 leading-snug border border-slate-200">
                  {job.problemDescription}
                </p>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="py-2.5 border-b-2 border-slate-900 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-600">{printLocale === 'bn' ? 'সম্ভাব্য/চূড়ান্ত মোট বিল:' : 'Total Cost:'}</span>
                <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(job.finalCost || job.estimatedCost, printLocale)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>{printLocale === 'bn' ? 'অগ্রিম জমা (Advance):' : 'Advance Paid:'}</span>
                <span className="font-bold tabular-nums">{formatCurrency(job.advancePaid, printLocale)}</span>
              </div>
              <div className="flex justify-between text-red-600 font-bold bg-red-50 p-1 rounded-sm">
                <span>{printLocale === 'bn' ? 'ডেলিভারির সময় প্রদেয় (Due):' : 'Due at Delivery:'}</span>
                <span className="tabular-nums">
                  {formatCurrency(Math.max(0, (job.finalCost || job.estimatedCost) - job.advancePaid), printLocale)}
                </span>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="pt-2.5 text-[9px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1 font-bold text-slate-700">
                <Clock className="w-3 h-3 text-slate-600" />
                <span>{printLocale === 'bn' ? 'জরুরি শর্তাবলী:' : 'Terms & Conditions:'}</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 leading-tight">
                <li>
                  {printLocale === 'bn'
                    ? 'ডেলিভারির সময় এই স্লিপ/টোকেন প্রদর্শন বাধ্যতামূলক।'
                    : 'This receipt must be presented at the time of delivery.'}
                </li>
                <li>
                  {printLocale === 'bn'
                    ? 'মেরামত শেষে ৩০ দিনের মধ্যে পণ্য বুঝে না নিলে দোকান কর্তৃপক্ষ দায়ী থাকিবে না।'
                    : 'Shop is not responsible for unclaimed devices after 30 days.'}
                </li>
                <li>
                  {printLocale === 'bn'
                    ? 'টাচ ও ডিসপ্লে ফিটিংসের ৩ দিন চেকিং ওয়ারেন্টি প্রদান করা হয়।'
                    : '3 days checking warranty applies to display/touch replacements.'}
                </li>
              </ul>

              <div className="pt-4 flex justify-between items-end text-[10px]">
                <div className="text-center">
                  <div className="w-24 border-b border-slate-400 mb-1"></div>
                  <span>{printLocale === 'bn' ? 'গ্রাহকের স্বাক্ষর' : 'Customer Sign'}</span>
                </div>
                <div className="text-center">
                  <div className="w-24 border-b border-slate-400 mb-1"></div>
                  <span>{printLocale === 'bn' ? 'কর্তৃপক্ষের স্বাক্ষর' : 'Authorized Sign'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200 print:hidden">
          <div className="text-xs text-slate-500">
            {printLocale === 'bn' ? 'স্লিপ প্রিন্ট করে কাস্টমারকে দিন' : 'Print token for customer'}
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
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{t.print_job_slip}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
