'use client';

import React from 'react';
import { useShop } from '@/context/shop-context';
import { translations } from '@/lib/i18n';
import { 
  X, 
  ShoppingCart, 
  Wrench, 
  Smartphone, 
  BookOpen, 
  Receipt, 
  Printer
} from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  const { locale, role } = useShop();
  const t = translations[locale];

  if (!isOpen) return null;

  const actions = [
    {
      id: 'pos',
      title: t.quick_new_sale,
      desc: locale === 'bn' ? 'দ্রুত বারকোড বা পণ্য বাছাই করে ক্যাশ মেমো' : 'Fast product cart billing and print invoice',
      icon: ShoppingCart,
      color: 'bg-emerald-500 text-white'
    },
    {
      id: 'service',
      title: t.quick_new_service,
      desc: locale === 'bn' ? 'কাস্টমারের ফোন গ্রহণ ও মেরামত টিকিট রিসিট' : 'Intake broken device & print job card',
      icon: Wrench,
      color: 'bg-blue-600 text-white'
    },
    {
      id: 'banking',
      title: t.quick_cash_in,
      desc: locale === 'bn' ? 'বিকাশ, নগদ বা রকেট ক্যাশ ইন / ক্যাশ আউট ও রিচার্জ' : 'bKash/Nagad Cash In, Out & Flexiload',
      icon: Smartphone,
      color: 'bg-pink-600 text-white'
    },
    {
      id: 'dues',
      title: t.quick_record_due,
      desc: locale === 'bn' ? 'কাস্টমারের পুরোনো বাকি জমা নেওয়া বা নতুন বাকি' : 'Collect due payment or check balance',
      icon: BookOpen,
      color: 'bg-purple-600 text-white'
    },
    {
      id: 'computer',
      title: locale === 'bn' ? 'ফটোকপি ও প্রিন্ট বিল' : 'Photocopy & Print',
      desc: locale === 'bn' ? 'ঝটপট পেজ হিসেব করে ক্যাশ মেমো' : 'Quick page billing & online applications',
      icon: Printer,
      color: 'bg-indigo-600 text-white'
    },
    {
      id: 'expenses',
      title: t.quick_new_expense,
      desc: locale === 'bn' ? 'দোকান ভাড়া, বিদ্যুৎ, নাস্তা ইত্যাদি খরচ লিখুন' : 'Log shop rent, utilities or food costs',
      icon: Receipt,
      color: 'bg-amber-600 text-white',
      hideForStaff: role === 'staff'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-action-title"
        className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h2 id="quick-action-title" className="text-base font-bold text-slate-900">{t.quick_actions}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[75vh] overflow-y-auto">
          {actions
            .filter((a) => !a.hideForStaff)
            .map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => {
                    onSelectAction(act.id);
                    onClose();
                  }}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${act.color} shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-emerald-800 truncate">
                      {act.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                      {act.desc}
                    </p>
                  </div>
                </button>
              );
            })}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
