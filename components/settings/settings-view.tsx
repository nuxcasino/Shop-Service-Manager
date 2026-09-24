'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { translations } from '@/lib/i18n';
import { Locale } from '@/types/shop';
import {
  Settings,
  Store,
  UserCheck,
  ShieldCheck,
  Check,
  Languages,
  Smartphone,
  Wrench,
  Printer,
  Package,
  Zap,
  Sun,
  ShoppingCart,
  BookOpen,
  Download,
  RotateCcw,
  CheckCircle2,
  Database,
  Lock,
  LogIn,
  Key
} from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';

export const SettingsView: React.FC = () => {
  const {
    business,
    updateBusiness,
    locale,
    setLocale,
    role,
    setRole,
    resetToDemoData,
    sessionUser,
    isNeon,
    isDatabaseConnected,
  } = useShop();

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const t = translations[locale];

  // Form State
  const [nameBn, setNameBn] = useState(business.nameBn);
  const [nameEn, setNameEn] = useState(business.nameEn);
  const [ownerName, setOwnerName] = useState(business.ownerName);
  const [phone, setPhone] = useState(business.phone);
  const [district, setDistrict] = useState(business.district);
  const [address, setAddress] = useState(business.address);
  const [taglineBn, setTaglineBn] = useState(business.taglineBn);
  const [defaultLang, setDefaultLang] = useState<Locale>(business.defaultLocale);
  const [categories, setCategories] = useState<string[]>(business.categories);
  const [isSaved, setIsSaved] = useState(false);

  const categoryOptions = [
    { id: 'banking', nameBn: 'মোবাইল ব্যাংকিং ও রিচার্জ (bKash/Nagad/Rocket)', nameEn: 'Mobile Banking & Recharge', icon: Smartphone },
    { id: 'service', nameBn: 'মোবাইল সার্ভিসিং ও হার্ডওয়্যার মেরামত', nameEn: 'Mobile Hardware Servicing', icon: Wrench },
    { id: 'computer', nameBn: 'কম্পিউটার, ফটোকপি ও অনলাইন আবেদন', nameEn: 'Computer & Photocopy Services', icon: Printer },
    { id: 'accessories', nameBn: 'মোবাইল এক্সেসরিজ (চার্জার, গ্লাস, কেবল)', nameEn: 'Mobile Accessories', icon: Package },
    { id: 'electrical', nameBn: 'ইলেকট্রিক্যাল ও গৃহস্থালি পণ্য', nameEn: 'Electrical Goods', icon: Zap },
    { id: 'seasonal', nameBn: 'মৌসুমি পণ্য (ফ্যান, হিটার, ছাতা)', nameEn: 'Seasonal Products', icon: Sun },
    { id: 'pos', nameBn: 'খুচরা বিক্রয় পিওএস (General Retail POS)', nameEn: 'General Retail POS', icon: ShoppingCart },
    { id: 'dues', nameBn: 'কাস্টমার বাকি খাতা (Credit Ledger)', nameEn: 'Customer Due Ledger', icon: BookOpen }
  ];

  const toggleCategory = (catId: string) => {
    setCategories((prev) => {
      const exists = prev.includes(catId);
      if (exists) {
        if (prev.length <= 1) return prev;
        return prev.filter((c) => c !== catId);
      }
      return [...prev, catId];
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness({
      nameBn,
      nameEn,
      ownerName,
      phone,
      district,
      address,
      taglineBn,
      defaultLocale: defaultLang,
      categories
    });
    setLocale(defaultLang);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportBackup = () => {
    const raw = localStorage.getItem('dokankhata_storage_v1');
    if (!raw) return;
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dokan_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700" />
          <span>{t.settings_title}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {locale === 'bn'
            ? 'দোকানের পরিচিতি, ঠিকানা, মডিউল নির্বাচন ও নিরাপত্তা সেটিংস'
            : 'Business profile, category module visibility, and role management'}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Profile Section */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>{t.business_profile}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t.shop_name_bn} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t.shop_name_en} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t.owner_name} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t.shop_phone} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t.district}
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t.full_address}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">
                {locale === 'bn' ? 'স্লোগান / ট্যাগলাইন' : 'Tagline'}
              </label>
              <input
                type="text"
                value={taglineBn}
                onChange={(e) => setTaglineBn(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Modules & Categories Section */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-600" />
              <span>{t.service_categories}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {locale === 'bn'
                ? 'যেসব সেবা অন করা থাকবে সেগুলোই অ্যাপের সাইডবার ও ড্যাশবোর্ডে দেখা যাবে।'
                : 'Modules checked here appear in the sidebar navigation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {categoryOptions.map((opt) => {
              const Icon = opt.icon;
              const isChecked = categories.includes(opt.id);

              return (
                <div
                  key={opt.id}
                  onClick={() => toggleCategory(opt.id)}
                  className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'border-emerald-600 bg-emerald-50/40 text-slate-900 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 text-slate-600 shrink-0" />
                    <span className="truncate">
                      {locale === 'bn' ? opt.nameBn : opt.nameEn}
                    </span>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isChecked
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300'
                    }`}
                  >
                    {isChecked && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role & Access Management */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{locale === 'bn' ? 'ব্যবহারকারী ভূমিকা ও পারমিশন' : 'User Role & Permissions'}</span>
          </h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div
              onClick={() => setRole('owner')}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                role === 'owner'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.owner} ({locale === 'bn' ? 'মালিক' : 'Owner'})</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {locale === 'bn'
                  ? 'সবকিছু দেখার ও পরিবর্তন করার সম্পূর্ণ ক্ষমতা (রিপোর্ট, সেটিংস, ডিলিট)।'
                  : 'Full access to financials, net profit, settings, and audits.'}
              </p>
            </div>

            <div
              onClick={() => setRole('staff')}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                role === 'staff'
                  ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>{t.staff} ({locale === 'bn' ? 'কর্মচারী' : 'Staff'})</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {locale === 'bn'
                  ? 'শুধুমাত্র বিক্রয়, মেরামত টিকিট ও ক্যাশ কালেকশন (রিপোর্ট লুকানো থাকে)।'
                  : 'Restricted POS and ticketing only. Financial reports hidden.'}
              </p>
            </div>
          </div>
        </div>

        {/* Database & Authentication Section (Neon + Drizzle + Better Auth) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>
                  {locale === 'bn'
                    ? 'ডাটাবেজ ও নিরাপত্তা সংযোগ (Neon PostgreSQL + Drizzle + Better Auth)'
                    : 'Database & Security (Neon PostgreSQL + Drizzle + Better Auth)'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {locale === 'bn'
                  ? 'প্রতিটি ইউজারের তথ্য সার্ভার-সাইড অনুমোদন ও সম্পূর্ণ আইসোলেটেড কুয়েরির মাধ্যমে সুরক্ষিত।'
                  : 'End-to-end user-level data isolation and secure server-side authorization.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>
                {sessionUser
                  ? locale === 'bn'
                    ? 'অ্যাকাউন্ট পরিবর্তন'
                    : 'Switch Account'
                  : locale === 'bn'
                  ? 'লগইন / সাইন ইন'
                  : 'Sign In / Register'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">
                {locale === 'bn' ? 'সক্রিয় অ্যাকাউন্ট' : 'Current Account'}
              </span>
              <p className="font-bold text-slate-900 truncate">
                {sessionUser ? sessionUser.name || sessionUser.email : (locale === 'bn' ? 'স্থানীয় ডেমো মোড' : 'Local Demo Mode')}
              </p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {sessionUser ? sessionUser.email : (locale === 'bn' ? 'লগইন করে ডাটা সংরক্ষণ করুন' : 'Sign in to sync with cloud DB')}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">
                {locale === 'bn' ? 'ডাটাবেজ ইঞ্জিন' : 'Database Engine'}
              </span>
              <p className="font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {isNeon ? 'Neon Serverless Postgres' : 'PostgreSQL / Memory Layer'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                ORM: Drizzle ORM v0.45+
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">
                {locale === 'bn' ? 'ডেটা আইসোলেশন ও অথ' : 'Isolation & Auth'}
              </span>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Better Auth v1.7+
              </p>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                {locale === 'bn' ? 'কঠোর ইউজার-লেভেল ফিল্টারিং সক্রিয়' : 'Strict User-Level Scoped Queries'}
              </p>
            </div>
          </div>
        </div>

        {/* Data Backup & Reset Actions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            {locale === 'bn' ? 'ডাটা ব্যাকআপ ও রিস্টোর' : 'Data Management'}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>{locale === 'bn' ? 'ব্যাকআপ JSON ডাউনলোড' : 'Download JSON Backup'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm(locale === 'bn' ? 'আপনি কি ডেমো ডাটা পুনরায় লোড করতে চান?' : 'Reset to sample demo data?')) {
                  resetToDemoData();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
            >
              <RotateCcw className="w-4 h-4 text-red-500" />
              <span>{locale === 'bn' ? 'ডেমো ডাটা পুনরায় লোড' : 'Reset to Demo Data'}</span>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {isSaved && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{locale === 'bn' ? 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'Settings saved successfully!'}</span>
            </div>
          )}
          {!isSaved && <div />}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors"
          >
            {t.save_settings}
          </button>
        </div>
      </form>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="signin"
      />
    </div>
  );
};
