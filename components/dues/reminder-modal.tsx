'use client';

import React, { useState } from 'react';
import { Customer, Locale } from '@/types/shop';
import { useShop } from '@/context/shop-context';
import { translations, formatCurrency } from '@/lib/i18n';
import { X, Copy, Check, Send, Languages, MessageSquare } from 'lucide-react';

interface ReminderModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  customer,
  isOpen,
  onClose
}) => {
  const { business, locale: defaultLocale } = useShop();
  const [templateLocale, setTemplateLocale] = useState<Locale>(defaultLocale);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !customer) return null;

  const t = translations[templateLocale];

  // Generated polite bilingual SMS reminder templates
  const messageBn = `প্রিয় ${customer.name}, শুভেচ্ছা নিন। আপনার অবগতির জন্য জানানো যাচ্ছে যে, '${business.nameBn}'-এ আপনার সর্বমোট বকেয়া বাকি রয়েছে ${formatCurrency(customer.dueBalance, 'bn')}। সুবিধাজনক সময়ে দোকানে এসে অথবা বিকাশ/নগদে (${business.phone}) বাকি পরিশোধ করার বিনীত অনুরোধ করা হলো। প্রয়োজনে যোগাযোগ করুন: ${business.phone}। ধন্যবাদ!`;

  const messageEn = `Dear ${customer.name}, greetings from ${business.nameEn}. This is a polite reminder that your outstanding due balance is ${formatCurrency(customer.dueBalance, 'en')}. We kindly request you to clear the payment at the shop or via bKash/Nagad at ${business.phone}. For any query, please call: ${business.phone}. Thank you!`;

  const activeMessage = templateLocale === 'bn' ? messageBn : messageEn;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    // Format bangladesh phone number: e.g. 01712-345678 -> 8801712345678
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    let targetPhone = cleanPhone;
    if (cleanPhone.startsWith('0')) {
      targetPhone = '88' + cleanPhone;
    }
    const encoded = encodeURIComponent(activeMessage);
    const link = document.createElement('a');
    link.href = `https://wa.me/${targetPhone}?text=${encoded}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminder-modal-title"
        className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <h2 id="reminder-modal-title" className="text-base font-bold text-slate-900">
              {templateLocale === 'bn' ? 'বাকি পরিশোধের তাগাদা SMS / বার্তা' : 'Due Reminder Message'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTemplateLocale(templateLocale === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition-colors"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{templateLocale === 'bn' ? 'EN' : 'বাং'}</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Customer Summary Card */}
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-purple-700 block font-medium">
                {templateLocale === 'bn' ? 'গ্রাহকের নাম ও ফোন' : 'Customer & Phone'}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {customer.name} ({customer.phone})
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-purple-700 block font-medium">
                {templateLocale === 'bn' ? 'বকেয়া বাকি' : 'Total Due'}
              </span>
              <span className="text-base font-bold text-red-600 font-mono tabular-nums">
                {formatCurrency(customer.dueBalance, templateLocale)}
              </span>
            </div>
          </div>

          {/* Generated Text Box */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
              {templateLocale === 'bn' ? 'বার্তা টেক্সট (এডিট করতে পারেন):' : 'Message Text (Editable):'}
            </label>
            <textarea
              readOnly
              rows={5}
              value={activeMessage}
              className="w-full text-xs text-slate-800 p-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-hidden font-sans leading-relaxed"
            />
          </div>

          <div className="text-[11px] text-slate-500 italic">
            {templateLocale === 'bn'
              ? 'টিপস: আপনি সরাসরি কপি করে সাধারণ মেসেজ দিতে পারেন অথবা নিচের বাটনে ক্লিক করে গ্রাহকের হোয়াটসঅ্যাপে পাঠাতে পারেন।'
              : 'Tip: Copy to clipboard to send standard SMS or send directly via WhatsApp.'}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
          >
            {t.close}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">{templateLocale === 'bn' ? 'কপি হয়েছে' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copy_sms}</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.open_whatsapp}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
