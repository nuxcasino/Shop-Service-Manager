'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { Product, PaymentMethod, Sale } from '@/types/shop';
import { translations, formatCurrency } from '@/lib/i18n';
import confetti from 'canvas-confetti';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  User,
  Phone,
  Tag,
  CreditCard,
  Banknote,
  Smartphone,
  BookOpen,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { InvoiceModal } from './invoice-modal';

export const PosView: React.FC = () => {
  const {
    locale,
    products,
    customers,
    createSale,
    createCustomer
  } = useShop();

  const t = translations[locale];

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<
    Array<{ productId: string; qty: number; unitPrice: number }>
  >([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Invoice modal
  const [activeSale, setActiveSale] = useState<Sale | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.sku && prod.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === 'all' || prod.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  // Cart calculations
  const cartDetailed = cartItems.map((item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return {
      ...item,
      product: p,
      subtotal: item.qty * item.unitPrice
    };
  });

  const subtotal = cartDetailed.reduce((sum, item) => sum + item.subtotal, 0);
  const totalAmount = Math.max(0, subtotal - discount);
  
  // Paid amount calculation
  const numericPaid = paidAmount === '' ? (paymentMethod === 'due' ? 0 : totalAmount) : Math.max(0, Number(paidAmount));
  const dueAmount = Math.max(0, totalAmount - numericPaid);
  const changeAmount = numericPaid > totalAmount ? numericPaid - totalAmount : 0;

  // Add to cart
  const addToCart = (product: Product) => {
    if (product.stockQty <= 0) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.qty >= product.stockQty) return prev; // Cannot exceed stock
        return prev.map((item) =>
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { productId: product.id, qty: 1, unitPrice: product.sellPrice }];
    });
  };

  const updateQuantity = (productId: string, newQty: number) => {
    const p = products.find((prod) => prod.id === productId);
    if (!p) return;
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    if (newQty > p.stockQty) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setPaidAmount('');
    setCustomerName('');
    setCustomerPhone('');
    setSelectedCustomerId('');
    setNotes('');
  };

  const handleSelectCustomer = (custId: string) => {
    setSelectedCustomerId(custId);
    const c = customers.find((cust) => cust.id === custId);
    if (c) {
      setCustomerName(c.name);
      setCustomerPhone(c.phone);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // If due > 0, customer name and phone are required
    if (dueAmount > 0 && !customerName.trim()) {
      alert(locale === 'bn' ? 'বাকি বিক্রয়ের ক্ষেত্রে গ্রাহকের নাম অবশ্যই প্রদান করতে হবে।' : 'Customer name is required for sales with due balance.');
      return;
    }

    const sale = createSale({
      customerId: selectedCustomerId || undefined,
      customerName: customerName.trim() || (locale === 'bn' ? 'নগদ ক্রেতা' : 'Walk-in Customer'),
      customerPhone: customerPhone.trim() || undefined,
      items: cartItems,
      discount,
      paidAmount: numericPaid,
      paymentMethod,
      notes: notes.trim() || undefined
    });

    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {
      // Ignore if unavailable
    }

    setActiveSale(sale);
    setIsInvoiceOpen(true);
    clearCart();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-12">
      {/* Product Catalog Column (Left) */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
        {/* Search & Filter Header */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search_product_placeholder}
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50/50"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.all_categories}
            </button>
            <button
              onClick={() => setSelectedCategory('accessories')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'accessories'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {locale === 'bn' ? 'মোবাইল এক্সেসরিজ' : 'Accessories'}
            </button>
            <button
              onClick={() => setSelectedCategory('electrical')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'electrical'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {locale === 'bn' ? 'ইলেকট্রিক্যাল' : 'Electrical'}
            </button>
            <button
              onClick={() => setSelectedCategory('seasonal')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'seasonal'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {locale === 'bn' ? 'মৌসুমি পণ্য' : 'Seasonal'}
            </button>
            <button
              onClick={() => setSelectedCategory('service_parts')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'service_parts'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {locale === 'bn' ? 'সার্ভিস পার্টস' : 'Spare Parts'}
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.map((prod) => {
            const inCart = cartItems.find((i) => i.productId === prod.id);
            const isOutOfStock = prod.stockQty <= 0;

            return (
              <div
                key={prod.id}
                onClick={() => !isOutOfStock && addToCart(prod)}
                className={`p-3 rounded-xl border bg-white flex flex-col justify-between text-left transition-all ${
                  isOutOfStock
                    ? 'opacity-50 cursor-not-allowed border-slate-200'
                    : 'cursor-pointer hover:border-emerald-500 hover:shadow-xs'
                } ${inCart ? 'ring-2 ring-emerald-600 border-transparent' : 'border-slate-200'}`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="truncate uppercase font-mono">{prod.sku || prod.category}</span>
                    <span
                      className={`font-semibold px-1.5 py-0.2 rounded-sm ${
                        isOutOfStock
                          ? 'bg-red-100 text-red-700'
                          : prod.stockQty <= prod.lowStockThreshold
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {locale === 'bn' ? `স্টক: ${prod.stockQty}` : `Stock: ${prod.stockQty}`}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                    {locale === 'bn' ? prod.nameBn : prod.nameEn}
                  </h3>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                    {formatCurrency(prod.sellPrice, locale)}
                  </span>
                  
                  {inCart ? (
                    <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      {inCart.qty}
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-700 font-medium">
                      + {locale === 'bn' ? 'যোগ' : 'Add'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-600 font-medium">
              {locale === 'bn' ? 'কোনো পণ্য খুঁজে পাওয়া যায়নি' : 'No products found'}
            </p>
          </div>
        )}
      </div>

      {/* Cart & Billing Column (Right) */}
      <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between h-fit sticky top-16 shadow-xs">
        <div>
          {/* Cart Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{t.cart}</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-800 transition-colors font-medium"
              >
                {locale === 'bn' ? 'কার্ট খালি করুন' : 'Clear'}
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="max-h-[280px] overflow-y-auto divide-y divide-slate-100 pr-1">
            {cartDetailed.map((item) => (
              <div key={item.productId} className="py-2.5 flex items-center justify-between gap-2">
                <div className="overflow-hidden flex-1">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">
                    {locale === 'bn' ? item.product?.nameBn : item.product?.nameEn}
                  </h4>
                  <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                    {formatCurrency(item.unitPrice, locale)} × {item.qty} ={' '}
                    <span className="font-bold text-slate-800">
                      {formatCurrency(item.subtotal, locale)}
                    </span>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.qty - 1)}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold font-mono">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.qty + 1)}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {cartItems.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                {t.cart_empty}
              </div>
            )}
          </div>

          {/* Customer Selection Form */}
          <div className="border-t border-slate-100 pt-3 mt-2 space-y-2">
            <span className="text-[11px] font-semibold text-slate-600 block">
              {t.customer_info}
            </span>

            {/* Existing Customer Quick Selector */}
            <select
              value={selectedCustomerId}
              onChange={(e) => handleSelectCustomer(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-hidden bg-slate-50 text-slate-800"
            >
              <option value="">{locale === 'bn' ? '-- নিয়মিত গ্রাহক নির্বাচন (ঐচ্ছিক) --' : '-- Select Existing Customer (Optional) --'}</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) - {locale === 'bn' ? 'বাকি' : 'Due'}: ৳{c.dueBalance}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder={t.customer_name}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-hidden"
              />
              <input
                type="tel"
                placeholder={t.customer_phone}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="border-t border-slate-100 pt-3 mt-3 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-600 block">
              {t.payment_method}
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`py-1.5 px-2 rounded-lg font-medium border flex items-center justify-center gap-1 transition-colors ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>{t.cash}</span>
              </button>
              <button
                onClick={() => setPaymentMethod('bkash')}
                className={`py-1.5 px-2 rounded-lg font-medium border flex items-center justify-center gap-1 transition-colors ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-600 bg-pink-50 text-pink-800 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-pink-600" />
                <span>{t.bkash}</span>
              </button>
              <button
                onClick={() => setPaymentMethod('nagad')}
                className={`py-1.5 px-2 rounded-lg font-medium border flex items-center justify-center gap-1 transition-colors ${
                  paymentMethod === 'nagad'
                    ? 'border-amber-600 bg-amber-50 text-amber-800 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.nagad}</span>
              </button>
              <button
                onClick={() => setPaymentMethod('due')}
                className={`py-1.5 px-2 rounded-lg font-medium border flex items-center justify-center gap-1 transition-colors ${
                  paymentMethod === 'due'
                    ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>{t.due}</span>
              </button>
            </div>
          </div>

          {/* Pricing Totals & Calculations */}
          <div className="border-t border-slate-100 pt-3 mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{t.subtotal}</span>
              <span className="font-mono tabular-nums">{formatCurrency(subtotal, locale)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span>{t.discount} (৳)</span>
              <input
                type="number"
                min="0"
                value={discount || ''}
                onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                placeholder="0"
                className="w-20 text-right p-1 rounded border border-slate-300 text-xs font-mono"
              />
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-slate-900 border-t border-slate-200 pt-1.5">
              <span>{t.total}</span>
              <span className="text-base text-emerald-700 font-mono tabular-nums">
                {formatCurrency(totalAmount, locale)}
              </span>
            </div>

            {/* Custom Paid Amount input for partial payment / change */}
            <div className="flex justify-between items-center text-slate-700 pt-1">
              <span>{t.paid_amount} (৳)</span>
              <input
                type="number"
                min="0"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder={paymentMethod === 'due' ? '0' : String(totalAmount)}
                className="w-24 text-right p-1 rounded border border-slate-300 text-xs font-mono font-bold"
              />
            </div>

            {dueAmount > 0 && (
              <div className="flex justify-between items-center text-red-600 font-bold bg-red-50 p-1.5 rounded-md">
                <span>{t.due_amount}</span>
                <span className="font-mono tabular-nums">{formatCurrency(dueAmount, locale)}</span>
              </div>
            )}

            {changeAmount > 0 && (
              <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-50 p-1.5 rounded-md">
                <span>{t.change_amount}</span>
                <span className="font-mono tabular-nums">{formatCurrency(changeAmount, locale)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Checkout Button */}
        <div className="pt-4 mt-2">
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className={`w-full py-3 px-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
              cartItems.length === 0
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{t.complete_sale}</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      <InvoiceModal
        sale={activeSale}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
};
