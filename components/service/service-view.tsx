'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { ServiceJob, ServiceStatus } from '@/types/shop';
import { translations, formatCurrency, formatDate } from '@/lib/i18n';
import {
  Wrench,
  Search,
  Plus,
  Clock,
  CheckCircle,
  Truck,
  Printer,
  ChevronRight,
  Shield,
  Smartphone,
  User,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { TicketSlipModal } from './ticket-slip-modal';

export const ServiceView: React.FC = () => {
  const {
    locale,
    serviceJobs,
    createServiceJob,
    updateServiceJobStatus,
    deliverServiceJob,
    products
  } = useShop();

  const t = translations[locale];

  // Pipeline Filter
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [activeSlipJob, setActiveSlipJob] = useState<ServiceJob | null>(null);
  const [isSlipOpen, setIsSlipOpen] = useState(false);

  // New ticket form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deviceBrand, setDeviceBrand] = useState('Samsung');
  const [deviceModel, setDeviceModel] = useState('');
  const [imei, setImei] = useState('');
  const [serviceType, setServiceType] = useState('Display / Touch Screen');
  const [problemDescription, setProblemDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [advancePaid, setAdvancePaid] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [warrantyDays, setWarrantyDays] = useState('3');
  const [notes, setNotes] = useState('');

  // Delivery Modal state
  const [deliverJob, setDeliverJob] = useState<ServiceJob | null>(null);
  const [collectedPayment, setCollectedPayment] = useState('');

  // Status mapping
  const statusLabels: Record<ServiceStatus, { bn: string; en: string; color: string }> = {
    received: { bn: 'গৃহীত', en: 'Received', color: 'bg-slate-100 text-slate-800' },
    in_progress: { bn: 'কাজ চলছে', en: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    waiting_for_parts: { bn: 'যন্ত্রাংশের অপেক্ষা', en: 'Waiting for Parts', color: 'bg-amber-100 text-amber-800' },
    ready: { bn: 'প্রস্তুত (রেডি)', en: 'Ready', color: 'bg-purple-100 text-purple-800' },
    delivered: { bn: 'ডেলিভারি সম্পন্ন', en: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
    cancelled: { bn: 'বাতিল', en: 'Cancelled', color: 'bg-red-100 text-red-800' }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !deviceModel.trim()) {
      alert(locale === 'bn' ? 'দয়া করে গ্রাহকের নাম, ফোন এবং মডেল লিখুন।' : 'Please enter customer name, phone, and device model.');
      return;
    }

    const estCostNum = Number(estimatedCost) || 0;
    const advPaidNum = Number(advancePaid) || 0;

    const newJob = createServiceJob({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deviceBrand,
      deviceModel: deviceModel.trim(),
      imei: imei.trim() || undefined,
      serviceType,
      problemDescription: problemDescription.trim() || 'General servicing',
      estimatedCost: estCostNum,
      advancePaid: advPaidNum,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
      warrantyDays: Number(warrantyDays) || 3,
      notes: notes.trim() || undefined
    });

    // Reset
    setCustomerName('');
    setCustomerPhone('');
    setDeviceModel('');
    setImei('');
    setProblemDescription('');
    setEstimatedCost('');
    setAdvancePaid('');
    setEstimatedDelivery('');
    setNotes('');
    setIsNewTicketOpen(false);

    // Open ticket slip for printing
    setActiveSlipJob(newJob);
    setIsSlipOpen(true);
  };

  const handleConfirmDelivery = () => {
    if (!deliverJob) return;
    const finalBill = deliverJob.finalCost || deliverJob.estimatedCost;
    const dueRemaining = Math.max(0, finalBill - deliverJob.advancePaid);
    const collected = collectedPayment === '' ? dueRemaining : Number(collectedPayment);

    deliverServiceJob(deliverJob.id, collected);
    setDeliverJob(null);
    setCollectedPayment('');
  };

  // Filter jobs
  const filteredJobs = serviceJobs.filter((job) => {
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesSearch =
      job.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerPhone.includes(searchQuery) ||
      job.deviceModel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" />
            <span>{t.service_title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {locale === 'bn'
              ? 'মোবাইল ফোন ও গ্যাজেট মেরামত টিকিট, কাজের অগ্রগতি ও ডেলিভারি ট্র্যাকার'
              : 'Mobile repair ticketing, pipeline status & warranty management'}
          </p>
        </div>

        <button
          onClick={() => setIsNewTicketOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>{t.new_ticket}</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {[
            { id: 'all', label: locale === 'bn' ? 'সব' : 'All' },
            { id: 'received', label: t.status_received },
            { id: 'in_progress', label: t.status_in_progress },
            { id: 'waiting_for_parts', label: t.status_waiting_for_parts },
            { id: 'ready', label: t.status_ready },
            { id: 'delivered', label: t.status_delivered }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.search_ticket}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs sm:text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden w-full sm:w-64"
          />
        </div>
      </div>

      {/* Service Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => {
          const statusInfo = statusLabels[job.status] || {
            bn: job.status,
            en: job.status,
            color: 'bg-slate-100'
          };
          const totalBill = job.finalCost || job.estimatedCost;
          const dueRemain = Math.max(0, totalBill - job.advancePaid);

          return (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:border-blue-400 transition-all shadow-2xs"
            >
              <div>
                {/* Header: Ticket # & Status Badge */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
                  <span className="font-bold text-blue-700 text-xs font-mono">
                    {job.ticketNo}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusInfo.color}`}
                  >
                    {locale === 'bn' ? statusInfo.bn : statusInfo.en}
                  </span>
                </div>

                {/* Device & Customer */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      {job.deviceBrand} {job.deviceModel}
                    </span>
                  </div>

                  <div className="text-slate-600 flex items-center justify-between text-[11px] pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{job.customerName}</span>
                    </span>
                    <span className="font-mono text-slate-500">
                      {job.customerPhone}
                    </span>
                  </div>

                  {job.imei && (
                    <div className="text-[10px] text-slate-400 font-mono">
                      IMEI: {job.imei}
                    </div>
                  )}

                  {/* Problem & Service */}
                  <div className="bg-slate-50 p-2 rounded-md mt-2 border border-slate-100 text-[11px]">
                    <span className="font-semibold text-slate-700 block">
                      {job.serviceType}
                    </span>
                    <p className="text-slate-500 line-clamp-2 mt-0.5">
                      {job.problemDescription}
                    </p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">
                      {locale === 'bn' ? 'মোট বিল (বিল/অগ্রিম)' : 'Total / Advance'}
                    </span>
                    <span className="font-bold text-slate-800 font-mono tabular-nums">
                      {formatCurrency(totalBill, locale)} / {formatCurrency(job.advancePaid, locale)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">
                      {locale === 'bn' ? 'বাকি প্রদেয়' : 'Due at Pickup'}
                    </span>
                    <span className="font-bold text-red-600 font-mono tabular-nums">
                      {formatCurrency(dueRemain, locale)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                {/* Print Slip Button */}
                <button
                  onClick={() => {
                    setActiveSlipJob(job);
                    setIsSlipOpen(true);
                  }}
                  title={t.print_job_slip}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                </button>

                {/* Status Dropdown */}
                {job.status !== 'delivered' ? (
                  <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <select
                      value={job.status}
                      onChange={(e) => updateServiceJobStatus(job.id, e.target.value as ServiceStatus)}
                      className="text-xs p-1 rounded-md border border-slate-300 bg-white text-slate-700 font-medium max-w-[130px]"
                    >
                      <option value="received">{t.status_received}</option>
                      <option value="in_progress">{t.status_in_progress}</option>
                      <option value="waiting_for_parts">{t.status_waiting_for_parts}</option>
                      <option value="ready">{t.status_ready}</option>
                      <option value="cancelled">{locale === 'bn' ? 'বাতিল' : 'Cancelled'}</option>
                    </select>

                    {job.status === 'ready' && (
                      <button
                        onClick={() => {
                          setDeliverJob(job);
                          setCollectedPayment(String(dueRemain));
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
                      >
                        {locale === 'bn' ? 'ডেলিভারি দিন' : 'Deliver'}
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{locale === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered'}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
          <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-medium">
            {locale === 'bn' ? 'কোনো সার্ভিস টিকিট পাওয়া যায়নি' : 'No service tickets found'}
          </p>
        </div>
      )}

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="intake-ticket-title"
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <h2 id="intake-ticket-title" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>{t.new_ticket}</span>
              </h2>
              <button
                onClick={() => setIsNewTicketOpen(false)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.customer_name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="মোঃ হাসান"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
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
                    placeholder="018XX-XXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.device_brand}
                  </label>
                  <select
                    value={deviceBrand}
                    onChange={(e) => setDeviceBrand(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi / Redmi</option>
                    <option value="Vivo">Vivo</option>
                    <option value="Oppo">Oppo</option>
                    <option value="Realme">Realme</option>
                    <option value="Infinix">Infinix</option>
                    <option value="Tecno">Tecno</option>
                    <option value="Apple">iPhone (Apple)</option>
                    <option value="Symphony">Symphony</option>
                    <option value="Walton">Walton</option>
                    <option value="Other">অন্যান্য (Other)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.device_model} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Galaxy A15 / Note 10"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.imei_serial}
                  </label>
                  <input
                    type="text"
                    placeholder="3582..."
                    value={imei}
                    onChange={(e) => setImei(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t.service_type}
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Display / Touch Screen">ডিসপ্লে ও টাচ স্ক্রিন পরিবর্তন (Display / Touch)</option>
                  <option value="Charging Port / Pin">চার্জিং পোর্ট / পিন সমস্যা (Charging Port)</option>
                  <option value="Battery Replacement">ব্যাটারি প্রতিস্থাপন (Battery Replacement)</option>
                  <option value="FRP / Google Lock Remove">FRP / গুগল লক / পাসওয়ার্ড খোলা (FRP / Lock)</option>
                  <option value="Flashing / Software Update">সফটওয়্যার ফ্ল্যাশিং / হ্যাং অন লোগো (Flashing)</option>
                  <option value="Speaker / Microphone / Ringer">স্পিকার / মাইক / রিংগার সমস্যা (Audio/Mic)</option>
                  <option value="Motherboard IC / Short Repair">মাদারবোর্ড শর্ট / আইসি মেরামত (Motherboard IC)</option>
                  <option value="Water Damage Service">পানিতে পড়া সার্ভিসিং (Water Damage)</option>
                  <option value="Camera Lens Repair">ক্যামেরা রিপেয়ার (Camera)</option>
                  <option value="Other Servicing">অন্যান্য সমস্যা (Other)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t.problem_desc}
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: ডিসপ্লেতে আলো আসে না, চার্জে দিলে গরম হয়..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.estimated_cost} (৳)
                  </label>
                  <input
                    type="number"
                    placeholder="1200"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.advance_paid} (৳)
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {locale === 'bn' ? 'ওয়ারেন্টি দিন' : 'Warranty (Days)'}
                  </label>
                  <input
                    type="number"
                    value={warrantyDays}
                    onChange={(e) => setWarrantyDays(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'সম্ভাব্য ডেলিভারির তারিখ' : 'Estimated Delivery Date'}
                </label>
                <input
                  type="date"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
                >
                  {locale === 'bn' ? 'টিকিট তৈরি ও রিসিট প্রিন্ট' : 'Create Ticket & Print Slip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deliver Device & Collect Balance Modal */}
      {deliverJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="deliver-modal-title"
            className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 id="deliver-modal-title" className="text-sm font-bold text-slate-900">
                {locale === 'bn' ? 'ডিভাইস ডেলিভারি ও বাকি সংগ্রহ' : 'Deliver Device & Collect Balance'} ({deliverJob.ticketNo})
              </h3>
              <button
                onClick={() => setDeliverJob(null)}
                aria-label="Close modal"
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.customer_name}:</span>
                  <span className="font-semibold text-slate-900">{deliverJob.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.device_model}:</span>
                  <span className="font-semibold text-slate-900">{deliverJob.deviceBrand} {deliverJob.deviceModel}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1">
                  <span className="text-slate-500">{locale === 'bn' ? 'মোট বিল:' : 'Total Cost:'}</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatCurrency(deliverJob.finalCost || deliverJob.estimatedCost, locale)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>{locale === 'bn' ? 'অগ্রিম জমা ছিল:' : 'Advance Paid:'}</span>
                  <span className="font-mono">
                    {formatCurrency(deliverJob.advancePaid, locale)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-red-600 border-t border-slate-200 pt-1">
                  <span>{locale === 'bn' ? 'অবশিষ্ট বাকি:' : 'Balance Due:'}</span>
                  <span className="font-mono">
                    {formatCurrency(Math.max(0, (deliverJob.finalCost || deliverJob.estimatedCost) - deliverJob.advancePaid), locale)}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'ডেলিভারিতে নগদ সংগ্রহ (৳)' : 'Collected Amount at Delivery (৳)'}
                </label>
                <input
                  type="number"
                  value={collectedPayment}
                  onChange={(e) => setCollectedPayment(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setDeliverJob(null)}
                  className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100"
                >
                  {t.close}
                </button>
                <button
                  onClick={handleConfirmDelivery}
                  className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  {locale === 'bn' ? 'ডেলিভারি সম্পন্ন করুন' : 'Confirm Delivery'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Slip Modal */}
      <TicketSlipModal
        job={activeSlipJob}
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
      />
    </div>
  );
};
