'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { translations } from '@/lib/i18n';
import { Locale } from '@/types/shop';
import { 
  Store, 
  X, 
  Check, 
  Smartphone, 
  Wrench, 
  Printer, 
  Package, 
  Zap, 
  Sun, 
  ShoppingCart, 
  BookOpen
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInitial?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  isInitial = false
}) => {
  const { business, updateBusiness, locale, setLocale } = useShop();
  const t = translations[locale];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nameBn: business.nameBn || '',
    nameEn: business.nameEn || '',
    ownerName: business.ownerName || '',
    phone: business.phone || '',
    district: business.district || 'ঢাকা',
    address: business.address || '',
    taglineBn: business.taglineBn || '',
    defaultLocale: business.defaultLocale || 'bn',
    categories: business.categories || [
      'banking',
      'service',
      'computer',
      'accessories',
      'electrical',
      'seasonal',
      'pos',
      'dues'
    ]
  });

  if (!isOpen) return null;

  const categoryOptions = [
    {
      id: 'banking',
      nameBn: 'মোবাইল ব্যাংকিং ও রিচার্জ (বিকাশ, নগদ, রকেট)',
      nameEn: 'Mobile Banking & Recharge (bKash, Nagad, Rocket)',
      icon: Smartphone,
      color: 'text-pink-600 bg-pink-50'
    },
    {
      id: 'service',
      nameBn: 'মোবাইল সার্ভিসিং ও হার্ডওয়্যার মেরামত',
      nameEn: 'Mobile Software & Hardware Service',
      icon: Wrench,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 'computer',
      nameBn: 'কম্পিউটার, ফটোকপি, প্রিন্ট ও অনলাইন আবেদন',
      nameEn: 'Computer, Photocopy, Print & Online Services',
      icon: Printer,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      id: 'accessories',
      nameBn: 'মোবাইল অ্যাক্সেসরিজ (চার্জার, গ্লাস, কেবল)',
      nameEn: 'Mobile Accessories (Charger, Cable, Glass)',
      icon: Package,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      id: 'electrical',
      nameBn: 'ইলেকট্রিক্যাল ও গৃহস্থালি পণ্য (বাল্ব, মাল্টিপ্লাগ)',
      nameEn: 'Electrical & Household Goods (LED Bulb, Multiplug)',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      id: 'seasonal',
      nameBn: 'মৌসুমি পণ্য (ফ্যান, রুম হিটার, ছাতা)',
      nameEn: 'Seasonal Products (Mini Fan, Room Heater)',
      icon: Sun,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      id: 'pos',
      nameBn: 'সাধারণ খুচরা বিক্রয় ও পিওএস (Retail POS)',
      nameEn: 'General Retail Sales & Point of Sale',
      icon: ShoppingCart,
      color: 'text-teal-600 bg-teal-50'
    },
    {
      id: 'dues',
      nameBn: 'কাস্টমার বাকি খাতা (Credit Ledger)',
      nameEn: 'Customer Due Ledger (বাকি Khata)',
      icon: BookOpen,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  const toggleCategory = (catId: string) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(catId);
      if (exists) {
        if (prev.categories.length <= 1) return prev; // Keep at least one
        return { ...prev, categories: prev.categories.filter((c) => c !== catId) };
      }
      return { ...prev, categories: [...prev.categories, catId] };
    });
  };

  const handleSave = () => {
    updateBusiness({
      nameBn: formData.nameBn,
      nameEn: formData.nameEn,
      ownerName: formData.ownerName,
      phone: formData.phone,
      district: formData.district,
      address: formData.address,
      taglineBn: formData.taglineBn,
      defaultLocale: formData.defaultLocale as Locale,
      categories: formData.categories,
      isConfigured: true
    });
    setLocale(formData.defaultLocale as Locale);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-modal-title"
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 id="onboarding-modal-title" className="text-base font-bold text-slate-900 leading-tight">
                {isInitial ? t.onboarding_title : t.business_profile}
              </h2>
              <span className="text-xs text-slate-500">
                {locale === 'bn' ? `ধাপ ${step} এর ২` : `Step ${step} of 2`}
              </span>
            </div>
          </div>

          {!isInitial && (
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {step === 1 ? (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.shop_name_bn} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    placeholder="যেমন: রহিম মোবাইল কেয়ার"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.shop_name_en} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Rahim Mobile Care"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.owner_name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="মোঃ আব্দুর রহিম"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.shop_phone} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01712-345678"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.district}
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="ঢাকা / চট্টগ্রাম / রাজশাহী"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.full_address}
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="দোকান #১৪, হাজী মার্কেট, মিরপুর-১০"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'স্লোগান / ট্যাগলাইন' : 'Shop Tagline'}
                </label>
                <input
                  type="text"
                  value={formData.taglineBn}
                  onChange={(e) => setFormData({ ...formData, taglineBn: e.target.value })}
                  placeholder="মোবাইল সার্ভিসিং, পার্টস, বিকাশ-নগদ ও কম্পিউটার সেবা"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  {t.default_lang}
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="lang"
                      checked={formData.defaultLocale === 'bn'}
                      onChange={() => setFormData({ ...formData, defaultLocale: 'bn' })}
                      className="accent-emerald-600"
                    />
                    <span>বাংলা (Bangla) - প্রস্তাবিত</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="lang"
                      checked={formData.defaultLocale === 'en'}
                      onChange={() => setFormData({ ...formData, defaultLocale: 'en' })}
                      className="accent-emerald-600"
                    />
                    <span>English</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  {t.service_categories}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {locale === 'bn'
                    ? 'যেসব সেবা আপনার দোকানে রয়েছে সেগুলো নির্বাচন করুন। নির্বাচিত মডিউলগুলোই সাইডবারে প্রদর্শিত হবে।'
                    : 'Select the services you offer. These will configure your sidebar modules.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {categoryOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isChecked = formData.categories.includes(opt.id);

                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleCategory(opt.id)}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 opacity-60'
                      }`}
                    >
                      <div className={`p-2 rounded-md shrink-0 ${opt.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 leading-tight">
                            {locale === 'bn' ? opt.nameBn : opt.nameEn}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-1 ${
                              isChecked
                                ? 'bg-emerald-600 text-white'
                                : 'border border-slate-300'
                            }`}
                          >
                            {isChecked && <Check className="w-2.5 h-2.5" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
            >
              {locale === 'bn' ? 'পূর্ববর্তী' : 'Back'}
            </button>
          ) : (
            <div>
              <span className="text-[11px] text-slate-400">
                মুদ্রা: BDT (৳) নির্ধারিত
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors"
              >
                {locale === 'bn' ? 'পরবর্তী: সেবাসমূহ' : 'Next: Modules'}
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors"
              >
                {t.save_settings}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
