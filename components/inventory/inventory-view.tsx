'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { Product, ProductCategory, SeasonalTag } from '@/types/shop';
import { translations, formatCurrency } from '@/lib/i18n';
import {
  Package,
  Search,
  Plus,
  AlertTriangle,
  Tag,
  Sun,
  Edit2,
  Trash2,
  CheckCircle2,
  Zap,
  Smartphone,
  Sliders,
  Sparkles
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    locale,
    products,
    addProduct,
    adjustStock
  } = useShop();

  const t = translations[locale];

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<ProductCategory>('accessories');
  const [seasonalTag, setSeasonalTag] = useState<SeasonalTag>('none');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('3');
  const [sku, setSku] = useState('');

  // Stock Adjustment Modal
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('New purchase / পাইকারি ক্রয়');
  const [isPositiveAdjust, setIsPositiveAdjust] = useState(true);

  // Submit Add Product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim() || !sellPrice) {
      alert(locale === 'bn' ? 'দয়া করে পণ্যের নাম ও বিক্রয় মূল্য দিন।' : 'Please enter product name and sell price.');
      return;
    }

    addProduct({
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim() || nameBn.trim(),
      category,
      seasonalTag,
      buyPrice: Number(buyPrice) || 0,
      sellPrice: Number(sellPrice) || 0,
      stockQty: Number(stockQty) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 3,
      sku: sku.trim() || undefined
    });

    // Reset
    setNameBn('');
    setNameEn('');
    setBuyPrice('');
    setSellPrice('');
    setStockQty('');
    setSku('');
    setIsAddModalOpen(false);
  };

  // Submit Stock Adjustment
  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    const qty = Number(adjustAmount);
    if (!qty || qty <= 0) return;

    const delta = isPositiveAdjust ? qty : -qty;
    adjustStock(adjustingProduct.id, delta, adjustReason);

    setAdjustingProduct(null);
    setAdjustAmount('');
  };

  // Filtered Products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.sku && prod.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = categoryFilter === 'all' || prod.category === categoryFilter;
    const matchesLowStock = !onlyLowStock || prod.stockQty <= prod.lowStockThreshold;

    return matchesSearch && matchesCat && matchesLowStock;
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>{t.inventory_title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {locale === 'bn'
              ? 'মোবাইল এক্সেসরিজ, ইলেকট্রিক্যাল, মৌসুমি পণ্য ও পার্টসের স্টক খাতা'
              : 'Product catalog, buy/sell pricing, seasonal tags, and low-stock alerts'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>{t.add_product}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.search_product_placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-amber-900 font-medium cursor-pointer bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
              <input
                type="checkbox"
                checked={onlyLowStock}
                onChange={(e) => setOnlyLowStock(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{locale === 'bn' ? 'শুধুমাত্র কম স্টক' : 'Only Low Stock'}</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: t.all_categories },
            { id: 'accessories', label: locale === 'bn' ? 'মোবাইল এক্সেসরিজ' : 'Accessories' },
            { id: 'electrical', label: locale === 'bn' ? 'ইলেকট্রিক্যাল' : 'Electrical' },
            { id: 'seasonal', label: locale === 'bn' ? 'মৌসুমি পণ্য' : 'Seasonal' },
            { id: 'service_parts', label: locale === 'bn' ? 'সার্ভিস পার্টস' : 'Service Parts' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">{locale === 'bn' ? 'পণ্যের নাম ও কোড' : 'Product & Code'}</th>
                <th className="text-left py-3 px-3 font-semibold">{t.category}</th>
                <th className="text-right py-3 px-3 font-semibold">{t.buy_price}</th>
                <th className="text-right py-3 px-3 font-semibold">{t.sell_price}</th>
                <th className="text-center py-3 px-3 font-semibold">{t.stock_qty}</th>
                <th className="text-center py-3 px-3 font-semibold">{t.stock_status}</th>
                <th className="text-right py-3 px-4 font-semibold">{locale === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => {
                const isLow = prod.stockQty <= prod.lowStockThreshold;
                const isOut = prod.stockQty <= 0;

                return (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {locale === 'bn' ? prod.nameBn : prod.nameEn}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        {prod.sku && <span className="font-mono">SKU: {prod.sku}</span>}
                        {prod.seasonalTag && prod.seasonalTag !== 'none' && (
                          <span className="flex items-center gap-0.5 text-amber-700 bg-amber-50 px-1 rounded-sm">
                            <Sun className="w-2.5 h-2.5" />
                            <span>{prod.seasonalTag}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      <span className="capitalize">{prod.category.replace('_', ' ')}</span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-500 tabular-nums">
                      {formatCurrency(prod.buyPrice, locale)}
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono tabular-nums">
                      {formatCurrency(prod.sellPrice, locale)}
                    </td>

                    <td className="py-3 px-3 text-center font-bold font-mono text-sm tabular-nums">
                      {prod.stockQty}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          isOut
                            ? 'bg-red-100 text-red-700'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOut
                          ? (locale === 'bn' ? 'স্টক শূন্য' : 'Out of Stock')
                          : isLow
                          ? (locale === 'bn' ? 'স্টক কম' : 'Low Stock')
                          : (locale === 'bn' ? 'পর্যাপ্ত' : 'In Stock')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setAdjustingProduct(prod);
                          setIsPositiveAdjust(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        {t.adjust_stock}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              {locale === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-product-title"
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 id="add-product-title" className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>{t.add_product}</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Close modal"
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {locale === 'bn' ? 'পণ্যের নাম (বাংলা)' : 'Product Name (Bangla)'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: টাইপ-সি ফাস্ট কেবল"
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {locale === 'bn' ? 'পণ্যের নাম (English)' : 'Product Name (English)'}
                  </label>
                  <input
                    type="text"
                    placeholder="Type-C Fast Cable"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.category}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="accessories">মোবাইল এক্সেসরিজ (Accessories)</option>
                    <option value="electrical">ইলেকট্রিক্যাল পণ্য (Electrical)</option>
                    <option value="seasonal">মৌসুমি পণ্য (Seasonal)</option>
                    <option value="service_parts">সার্ভিসিং যন্ত্রাংশ (Service Parts)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {locale === 'bn' ? 'মৌসুমি ট্যাগ' : 'Seasonal Tag'}
                  </label>
                  <select
                    value={seasonalTag}
                    onChange={(e) => setSeasonalTag(e.target.value as SeasonalTag)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="none">কোনোটি নয় (Regular)</option>
                    <option value="summer">গ্রীষ্মকালীন (Summer - Mini Fan)</option>
                    <option value="winter">শীতকালীন (Winter - Heater, Geyser)</option>
                    <option value="monsoon">বর্ষাকালীন (Monsoon - Umbrella)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.buy_price} (পাইকারি রেট ৳)
                  </label>
                  <input
                    type="number"
                    placeholder="120"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.sell_price} (খুচরা রেট ৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="250"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.stock_qty}
                  </label>
                  <input
                    type="number"
                    placeholder="20"
                    value={stockQty}
                    onChange={(e) => setStockQty(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.low_stock_limit}
                  </label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    SKU / বারকোড
                  </label>
                  <input
                    type="text"
                    placeholder="CAB-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  {t.save_settings}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="adjust-stock-title"
            className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 id="adjust-stock-title" className="text-sm font-bold text-slate-900">
                {t.adjust_stock}: {locale === 'bn' ? adjustingProduct.nameBn : adjustingProduct.nameEn}
              </h3>
              <button
                onClick={() => setAdjustingProduct(null)}
                aria-label="Close modal"
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStockAdjustment} className="p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-600 bg-slate-50 p-2 rounded-md">
                <span>{locale === 'bn' ? 'বর্তমান স্টক:' : 'Current Stock:'}</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  {adjustingProduct.stockQty}
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'স্টক সমন্বয়ের ধরণ' : 'Adjustment Type'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPositiveAdjust(true)}
                    className={`py-1.5 rounded-md font-bold text-xs ${
                      isPositiveAdjust
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    + {locale === 'bn' ? 'স্টক বৃদ্ধি (ক্রয়)' : 'Add Stock'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPositiveAdjust(false)}
                    className={`py-1.5 rounded-md font-bold text-xs ${
                      !isPositiveAdjust
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    - {locale === 'bn' ? 'স্টক হ্রাস (ক্ষতি)' : 'Reduce Stock'}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'পরিমাণ (সংখ্যা)' : 'Quantity'}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="5"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'bn' ? 'কারণ' : 'Reason'}
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="New purchase / পাইকারি ক্রয়">New purchase / পাইকারি ক্রয়</option>
                  <option value="Damaged / নষ্ট বা ক্ষতিগ্রস্ত">Damaged / নষ্ট বা ক্ষতিগ্রস্ত</option>
                  <option value="Audit correction / হিসাব মিলকরণ">Audit correction / হিসাব মিলকরণ</option>
                  <option value="Returned / পণ্য ফেরত">Customer Return / ফেরত</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {locale === 'bn' ? 'আপডেট করুন' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
