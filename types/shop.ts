export type Locale = 'bn' | 'en';
export type UserRole = 'owner' | 'staff';

export interface BusinessCategoryConfig {
  id: string;
  nameBn: string;
  nameEn: string;
  enabled: boolean;
  icon: string;
}

export interface PhotocopyRates {
  photocopyBw: number;
  photocopyColor: number;
  printBw: number;
  printColor: number;
  scanPerPage: number;
  photoPassport4: number;
  photoPassport8: number;
  photoEdit: number;
  laminationId: number;
  laminationA4: number;
}

export interface Business {
  id: string;
  nameBn: string;
  nameEn: string;
  ownerName: string;
  phone: string;
  address: string;
  district: string;
  logoUrl?: string;
  taglineBn: string;
  taglineEn: string;
  defaultLocale: Locale;
  currency: 'BDT';
  categories: string[]; // Enabled category module IDs
  rates: PhotocopyRates;
  createdAt: string;
  isConfigured: boolean;
}

export interface User {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  address?: string;
  dueBalance: number;
  totalSpent: number;
  createdAt: string;
  lastTransactionAt?: string;
}

export type ProductCategory = 'accessories' | 'electrical' | 'seasonal' | 'service_parts' | 'other' | string;
export type SeasonalTag = 'none' | 'summer' | 'winter' | 'monsoon' | string;

export interface Product {
  id: string;
  businessId: string;
  nameBn: string;
  nameEn: string;
  category: ProductCategory;
  buyPrice: number;
  sellPrice: number;
  stockQty: number;
  unit?: string; // 'pcs' | 'box' | 'meter' | 'set'
  lowStockThreshold: number;
  photoUrl?: string;
  seasonalTag?: SeasonalTag;
  isSeasonal?: boolean;
  season?: 'summer' | 'winter' | 'all_year' | string;
  supplier?: string;
  sku?: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  nameBn: string;
  nameEn: string;
  unitPrice: number;
  buyPrice: number;
  qty: number;
  subtotal: number;
}

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'rocket' | 'due' | 'mixed';

export interface Sale {
  id: string;
  invoiceNo: string;
  businessId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type ServiceStatus = 
  | 'received' 
  | 'in_progress' 
  | 'waiting_for_parts' 
  | 'ready' 
  | 'delivered' 
  | 'cancelled';

export interface ServicePartUsed {
  productId?: string;
  name: string;
  cost: number;
  price: number;
  qty: number;
}

export interface ServiceJob {
  id: string;
  ticketNo: string;
  businessId: string;
  customerName: string;
  customerPhone: string;
  deviceBrand: string;
  deviceModel: string;
  imei?: string;
  serviceType: string; // e.g. Lock/Unlock, FRP, Display/Glass, Charging Port, etc.
  problemDescription: string;
  status: ServiceStatus;
  estimatedCost: number;
  finalCost: number;
  advancePaid: number;
  dueAmount: number;
  partsUsed: ServicePartUsed[];
  laborCost: number;
  notificationNote?: string;
  customerNotes?: string;
  notes?: string;
  warrantyDays?: number;
  estimatedDelivery?: string;
  receivedDate: string;
  completedDate?: string;
  deliveryDate?: string;
  createdBy: string;
  updatedAt: string;
}

export type CreateServiceJobInput = {
  customerName: string;
  customerPhone: string;
  deviceBrand: string;
  deviceModel: string;
  imei?: string;
  serviceType: string;
  problemDescription: string;
  estimatedCost: number;
  advancePaid: number;
  estimatedDelivery?: string | Date;
  warrantyDays?: number;
  notes?: string;
  status?: ServiceStatus;
  finalCost?: number;
  dueAmount?: number;
  partsUsed?: ServicePartUsed[];
  laborCost?: number;
};

export type MobileBankingProvider = 'bkash' | 'nagad' | 'rocket' | 'upay';
export type MobileBankingType = 'cash_in' | 'cash_out';

export interface MobileBankingTx {
  id: string;
  businessId: string;
  provider: MobileBankingProvider;
  type: MobileBankingType;
  customerPhone: string;
  amount: number;
  commission: number;
  agentNumber?: string;
  txId?: string;
  note?: string;
  createdAt: string;
}

export type TelecomOperator = 'gp' | 'banglalink' | 'robi' | 'airtel' | 'skitto';

export interface RechargeTx {
  id: string;
  businessId: string;
  operator: TelecomOperator;
  phone: string;
  amount: number;
  commission: number;
  isPostpaid?: boolean;
  createdAt: string;
}

export interface ProviderBalance {
  provider: MobileBankingProvider;
  openingBalance: number;
  currentBalance: number;
  targetBalance?: number;
}

export interface OnlineServiceItem {
  id: string;
  businessId: string;
  serviceType: string; // 'job_app' | 'admission' | 'nid_service' | 'birth_cert' | 'passport' | 'bill_pay' | 'other'
  customerName: string;
  customerPhone: string;
  govFee: number;
  serviceCharge: number;
  totalFee: number;
  status: 'submitted' | 'processing' | 'completed';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface CounterServiceLog {
  id: string;
  businessId: string;
  itemType: 'photocopy' | 'print' | 'scan' | 'photo' | 'lamination';
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
}

export interface DueLedgerEntry {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  relatedSaleId?: string;
  relatedServiceId?: string;
  amount: number; // positive = increased due (charge), negative = payment received
  type: 'charge' | 'payment';
  paymentMethod?: string;
  note: string;
  balanceAfter: number;
  createdAt: string;
}

export interface DuePayment {
  id: string;
  businessId: string;
  customerId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  collectedBy: string;
  createdAt: string;
  notes?: string;
}

export type ExpenseCategory = 
  | 'rent'
  | 'electricity'
  | 'salary'
  | 'tea_snacks'
  | 'transport'
  | 'tools'
  | 'consumables'
  | 'internet'
  | 'misc';

export interface Expense {
  id: string;
  businessId: string;
  category: ExpenseCategory;
  amount: number;
  paymentMethod?: PaymentMethod;
  note?: string;
  voucherNo?: string;
  createdAt: string;
}
