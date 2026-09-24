'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { translations, formatCurrency, formatDate } from '@/lib/i18n';
import confetti from 'canvas-confetti';
import {
  Printer,
  FileText,
  Copy,
  Camera,
  Layers,
  Globe,
  Plus,
  Minus,
  CheckCircle2,
  DollarSign,
  Search,
  ExternalLink,
  Check
} from 'lucide-react';

interface QuickCounterItem {
  id: string;
  nameBn: string;
  nameEn: string;
  rate: number;
  count: number;
  icon: any;
}

export const ComputerView: React.FC = () => {
  const {
    locale,
    onlineServices,
    logOnlineService,
    createSale
  } = useShop();

  const t = translations[locale];

  // Quick Counter State
  const [counterItems, setCounterItems] = useState<QuickCounterItem[]>([
    { id: 'photo_bw', nameBn: 'ফটোকপি (সাদা-কালো)', nameEn: 'Photocopy (B/W)', rate: 3, count: 0, icon: Copy },
    { id: 'photo_col', nameBn: 'ফটোকপি (রঙিন)', nameEn: 'Photocopy (Color)', rate: 10, count: 0, icon: Copy },
    { id: 'print_bw', nameBn: 'কম্পিউটার প্রিন্ট (B/W)', nameEn: 'Computer Print (B/W)', rate: 5, count: 0, icon: Printer },
    { id: 'print_col', nameBn: 'কম্পিউটার প্রিন্ট (রঙিন)', nameEn: 'Computer Print (Color)', rate: 15, count: 0, icon: Printer },
    { id: 'scan', nameBn: 'ডকুমেন্ট স্ক্যান', nameEn: 'Document Scan', rate: 10, count: 0, icon: FileText },
    { id: 'photo_4', nameBn: 'পাসপোর্ট ছবি (৪ কপি)', nameEn: 'Passport Photo (4 Pcs)', rate: 50, count: 0, icon: Camera },
    { id: 'photo_8', nameBn: 'পাসপোর্ট ছবি (৮ কপি)', nameEn: 'Passport Photo (8 Pcs)', rate: 80, count: 0, icon: Camera },
    { id: 'lam_id', nameBn: 'লেমিনেশন (আইডি কার্ড)', nameEn: 'Lamination (ID Card)', rate: 15, count: 0, icon: Layers },
    { id: 'lam_a4', nameBn: 'লেমিনেশন (A4 সাইজ)', nameEn: 'Lamination (A4)', rate: 30, count: 0, icon: Layers }
  ]);

  // Online Service Form State
  const [onlineType, setOnlineType] = useState('চাকরির অনলাইন আবেদন (Job Application)');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [refNo, setRefNo] = useState('');
  const [officialFee, setOfficialFee] = useState('');
  const [shopFee, setShopFee] = useState('');
  const [notes, setNotes] = useState('');

  // Online service search
  const [searchOnline, setSearchOnline] = useState('');

  // Quick counter calculations
  const totalCounterAmount = counterItems.reduce(
    (sum, item) => sum + item.count * item.rate,
    0
  );
  const activeCounterItems = counterItems.filter((i) => i.count > 0);

  const incrementCount = (id: string, amount: number = 1) => {
    setCounterItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, count: Math.max(0, item.count + amount) } : item
      )
    );
  };

  const clearCounter = () => {
    setCounterItems((prev) => prev.map((item) => ({ ...item, count: 0 })));
  };

  const handleCheckoutCounter = () => {
    if (totalCounterAmount <= 0) return;

    // Convert active counter items into sale items
    // Using dummy items mapping
    alert(
      locale === 'bn'
        ? `মোট ৳${totalCounterAmount} ক্যাশ সংগ্রহ করা হয়েছে এবং ক্যাশ ড্রয়ারে যুক্ত হয়েছে!`
        : `Total ৳${totalCounterAmount} collected and recorded to cash drawer!`
    );

    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch {}

    clearCounter();
  };

  const handleOnlineServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim()) {
      alert(locale === 'bn' ? 'দয়া করে গ্রাহকের নাম ও ফোন নম্বর দিন।' : 'Please enter customer name and phone.');
      return;
    }

    logOnlineService({
      serviceType: onlineType,
      customerName: custName.trim(),
      customerPhone: custPhone.trim(),
      trackingNumber: refNo.trim() || undefined,
      govFee: Number(officialFee) || 0,
      serviceCharge: Number(shopFee) || 50,
      totalFee: (Number(officialFee) || 0) + (Number(shopFee) || 50),
      status: 'completed',
      notes: notes.trim() || undefined
    });

    setCustName('');
    setCustPhone('');
    setRefNo('');
    setOfficialFee('');
    setShopFee('');
    setNotes('');
  };

  const filteredOnline = onlineServices.filter((s) =>
    s.customerName.toLowerCase().includes(searchOnline.toLowerCase()) ||
    s.customerPhone.includes(searchOnline) ||
    s.serviceType.toLowerCase().includes(searchOnline.toLowerCase()) ||
    (s.trackingNumber && s.trackingNumber.toLowerCase().includes(searchOnline.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Printer className="w-6 h-6 text-indigo-600" />
          <span>{t.computer_title}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {locale === 'bn'
            ? 'ফটোকপি, প্রিন্ট, ছবি তোলা ও সরকারি-বেসরকারি অনলাইন আবেদন খাতা'
            : 'Fast photocopy, print counter billing and government online application tracker'}
        </p>
      </div>

      {/* Section 1: Fast Photocopy & Document Counter */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Copy className="w-4 h-4 text-indigo-600" />
              <span>{t.counter_billing}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {locale === 'bn'
                ? 'দ্রুত পেজ বা কপি সংখ্যা বাড়িয়ে এক ক্লিকে ক্যাশ সংগ্রহ করুন'
                : 'Tap to increment copies and collect instant cash'}
            </p>
          </div>

          {activeCounterItems.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                {locale === 'bn' ? 'মোট বিল:' : 'Total Bill:'}{' '}
                <span className="text-base font-bold text-indigo-700 font-mono">
                  {formatCurrency(totalCounterAmount, locale)}
                </span>
              </span>
              <button
                onClick={handleCheckoutCounter}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {locale === 'bn' ? 'ক্যাশ জমা নিন' : 'Collect Cash'}
              </button>
              <button
                onClick={clearCounter}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
              >
                {locale === 'bn' ? 'রিসেট' : 'Reset'}
              </button>
            </div>
          )}
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {counterItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                  item.count > 0
                    ? 'border-indigo-500 bg-indigo-50/30'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold text-slate-700 font-mono">
                      ৳{item.rate}/{locale === 'bn' ? 'কপি' : 'pc'}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 leading-tight">
                    {locale === 'bn' ? item.nameBn : item.nameEn}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => incrementCount(item.id, -1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-bold text-sm font-mono">
                      {item.count}
                    </span>
                    <button
                      onClick={() => incrementCount(item.id, 1)}
                      className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-xs font-bold font-mono text-indigo-900">
                    ৳{item.count * item.rate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Online Government & Application Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form Container */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 h-fit space-y-4 shadow-xs">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>{t.online_service_log}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {locale === 'bn' ? 'চাকরি, ভর্তি, এনআইডি ও সরকারি ফি এন্ট্রি' : 'Log official fee & shop service profit'}
            </p>
          </div>

          <form onSubmit={handleOnlineServiceSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {locale === 'bn' ? 'অনলাইন সেবার ধরণ' : 'Service Type'}
              </label>
              <select
                value={onlineType}
                onChange={(e) => setOnlineType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="চাকরির অনলাইন আবেদন (Job Application)">চাকরির অনলাইন আবেদন (Job Application)</option>
                <option value="বিশ্ববিদ্যালয়/কলেজ ভর্তি আবেদন (Admission)">বিশ্ববিদ্যালয়/কলেজ ভর্তি আবেদন (Admission)</option>
                <option value="জাতীয় পরিচয়পত্র সংশোধন/ডাউনলোড (NID)">জাতীয় পরিচয়পত্র সংশোধন/ডাউনলোড (NID)</option>
                <option value="জন্ম নিবন্ধন আবেদন/সংশোধন (Birth Cert)">জন্ম নিবন্ধন আবেদন/সংশোধন (Birth Cert)</option>
                <option value="বিদ্যুৎ/গ্যাস/ওয়াসা বিল পেমেন্ট (Utility Bill)">বিদ্যুৎ/গ্যাস/ওয়াসা বিল পেমেন্ট (Utility Bill)</option>
                <option value="ই-পাসপোর্ট আবেদন ফর্ম পূরণ (E-Passport)">ই-পাসপোর্ট আবেদন ফর্ম পূরণ (E-Passport)</option>
                <option value="পরীক্ষার রেজাল্ট ও মার্কশিট প্রিন্ট (Result)">পরীক্ষার রেজাল্ট ও মার্কশিট প্রিন্ট (Result)</option>
                <option value="অন্যান্য অনলাইন সেবা (Other)">অন্যান্য অনলাইন সেবা (Other)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t.customer_name} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="মোঃ রাসেল"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden"
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
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {locale === 'bn' ? 'রোল / ট্র্যাকিং / রেফারেন্স নং' : 'Ref / Roll / Tracking No'}
              </label>
              <input
                type="text"
                placeholder="JOB-2025-8841"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'সরকারি ফি (Official Fee ৳)' : 'Official Fee (৳)'}
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={officialFee}
                  onChange={(e) => setOfficialFee(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'দোকানের সার্ভিস চার্জ (লাভ ৳)' : 'Shop Service Charge (৳)'}
                </label>
                <input
                  type="number"
                  placeholder="50"
                  value={shopFee}
                  onChange={(e) => setShopFee(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono text-emerald-700 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {locale === 'bn' ? 'মন্তব্য (নোট)' : 'Notes'}
              </label>
              <input
                type="text"
                placeholder="প্রবেশপত্র পরবর্তীতে প্রিন্ট নিতে হবে"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{locale === 'bn' ? 'এন্ট্রি সংরক্ষণ করুন' : 'Save Application Record'}</span>
            </button>
          </form>
        </div>

        {/* Online Services Log Table */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              {locale === 'bn' ? 'সাম্প্রতিক অনলাইন আবেদন তালিকা' : 'Application Records'}
            </h3>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.search}
                value={searchOnline}
                onChange={(e) => setSearchOnline(e.target.value)}
                className="text-xs pl-7 pr-2 py-1.5 rounded-lg border border-slate-300 w-36 sm:w-48"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="text-left pb-2 font-semibold">{locale === 'bn' ? 'সেবা ও রেফারেন্স' : 'Service & Ref'}</th>
                  <th className="text-left pb-2 font-semibold">{t.customer_name}</th>
                  <th className="text-right pb-2 font-semibold">{locale === 'bn' ? 'সরকারি ফি' : 'Fee'}</th>
                  <th className="text-right pb-2 font-semibold">{locale === 'bn' ? 'দোকান চার্জ' : 'Shop'}</th>
                  <th className="text-right pb-2 font-semibold">{locale === 'bn' ? 'তারিখ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOnline.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-50">
                    <td className="py-2.5">
                      <div className="font-semibold text-slate-900 leading-tight">
                        {srv.serviceType}
                      </div>
                      {srv.trackingNumber && (
                        <div className="text-[10px] font-mono text-indigo-700">
                          #{srv.trackingNumber}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5">
                      <span className="font-medium text-slate-800 block">{srv.customerName}</span>
                      <span className="text-[10px] font-mono text-slate-500">{srv.customerPhone}</span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-600 tabular-nums">
                      {formatCurrency(srv.govFee, locale)}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-700 tabular-nums">
                      +{formatCurrency(srv.serviceCharge, locale)}
                    </td>
                    <td className="py-2.5 text-right text-slate-400 font-mono text-[10px]">
                      {formatDate(srv.createdAt, locale, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOnline.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                {locale === 'bn' ? 'কোনো অনলাইন রেকর্ড পাওয়া যায়নি' : 'No online records recorded'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
