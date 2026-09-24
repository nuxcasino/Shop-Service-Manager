import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  real,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// 1. Better Auth Core Schema (User, Session, Account, Verification)
// ============================================================================

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: text('role').default('owner').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// 2. Application Domain Tables (Strict User-Level Data Isolation)
// ============================================================================

// Shop / Business Configuration per user
export const businesses = pgTable('businesses', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  nameBn: text('name_bn').notNull(),
  nameEn: text('name_en').notNull(),
  ownerName: text('owner_name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  district: text('district').notNull(),
  taglineBn: text('tagline_bn'),
  taglineEn: text('tagline_en'),
  defaultLocale: text('default_locale').default('bn').notNull(),
  currency: text('currency').default('BDT').notNull(),
  categories: jsonb('categories').notNull(),
  rates: jsonb('rates').notNull(),
  isConfigured: boolean('is_configured').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Products & Inventory per user
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  businessId: text('business_id'),
  nameBn: text('name_bn').notNull(),
  nameEn: text('name_en').notNull(),
  category: text('category').notNull(),
  buyPrice: integer('buy_price').notNull(),
  sellPrice: integer('sell_price').notNull(),
  stockQty: integer('stock_qty').notNull(),
  unit: text('unit').default('pcs'),
  lowStockThreshold: integer('low_stock_threshold').notNull(),
  photoUrl: text('photo_url'),
  seasonalTag: text('seasonal_tag'),
  isSeasonal: boolean('is_seasonal').default(false).notNull(),
  season: text('season'),
  supplier: text('supplier'),
  sku: text('sku'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Customers per user
export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  businessId: text('business_id'),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  address: text('address'),
  dueBalance: integer('due_balance').default(0).notNull(),
  totalSpent: integer('total_spent').default(0).notNull(),
  lastTransactionAt: timestamp('last_transaction_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Sales & Invoices per user
export const sales = pgTable('sales', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  businessId: text('business_id'),
  invoiceNo: text('invoice_no').notNull(),
  customerId: text('customer_id'),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone'),
  items: jsonb('items').notNull(),
  subtotal: integer('subtotal').notNull(),
  discount: integer('discount').default(0).notNull(),
  totalAmount: integer('total_amount').notNull(),
  paidAmount: integer('paid_amount').notNull(),
  dueAmount: integer('due_amount').default(0).notNull(),
  paymentMethod: text('payment_method').notNull(),
  notes: text('notes'),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Repair / Service Jobs per user
export const serviceJobs = pgTable('service_jobs', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  businessId: text('business_id'),
  ticketNo: text('ticket_no').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  deviceBrand: text('device_brand').notNull(),
  deviceModel: text('device_model').notNull(),
  imei: text('imei'),
  serviceType: text('service_type').notNull(),
  problemDescription: text('problem_description').notNull(),
  status: text('status').notNull(),
  estimatedCost: integer('estimated_cost').notNull(),
  finalCost: integer('final_cost'),
  advancePaid: integer('advance_paid').default(0).notNull(),
  dueAmount: integer('due_amount').default(0).notNull(),
  partsUsed: jsonb('parts_used'),
  laborCost: integer('labor_cost').default(0).notNull(),
  warrantyDays: integer('warranty_days').default(0).notNull(),
  estimatedDelivery: timestamp('estimated_delivery'),
  notes: text('notes'),
  notificationNote: text('notification_note'),
  receivedDate: timestamp('received_date').defaultNow().notNull(),
  completedDate: timestamp('completed_date'),
  deliveryDate: timestamp('delivery_date'),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Mobile Banking Provider Balances per user
export const providerBalances = pgTable('provider_balances', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  openingBalance: integer('opening_balance').default(0).notNull(),
  currentBalance: integer('current_balance').default(0).notNull(),
  targetBalance: integer('target_balance'),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

// Mobile Banking Transactions per user
export const mobileBankingTx = pgTable('mobile_banking_tx', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  businessId: text('business_id'),
  provider: text('provider').notNull(),
  type: text('type').notNull(),
  customerPhone: text('customer_phone').notNull(),
  amount: integer('amount').notNull(),
  commission: real('commission').default(0).notNull(),
  agentNumber: text('agent_number'),
  txId: text('tx_id'),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Mobile Flexiload / Recharges per user
export const recharges = pgTable('recharges', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  businessId: text('business_id'),
  operator: text('operator').notNull(),
  phone: text('phone').notNull(),
  amount: integer('amount').notNull(),
  commission: real('commission').default(0).notNull(),
  isPostpaid: boolean('is_postpaid').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Computer / Photocopy / Online Services per user
export const onlineServices = pgTable('online_services', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  businessId: text('business_id'),
  serviceType: text('service_type').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  govFee: integer('gov_fee').default(0).notNull(),
  serviceCharge: integer('service_charge').notNull(),
  totalFee: integer('total_fee').notNull(),
  status: text('status').default('completed').notNull(),
  trackingNumber: text('tracking_number'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Shop Daily Expenses per user
export const expenses = pgTable('expenses', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  businessId: text('business_id'),
  category: text('category').notNull(),
  amount: integer('amount').notNull(),
  paymentMethod: text('payment_method'),
  note: text('note'),
  voucherNo: text('voucher_no'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Due / Bakir Khata Ledger per user
export const dueLedger = pgTable('due_ledger', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  businessId: text('business_id'),
  customerId: text('customer_id').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  relatedSaleId: text('related_sale_id'),
  relatedServiceId: text('related_service_id'),
  type: text('type').notNull(),
  amount: integer('amount').notNull(),
  note: text('note').notNull(),
  balanceAfter: integer('balance_after').default(0).notNull(),
  paymentMethod: text('payment_method'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  businesses: many(businesses),
  products: many(products),
  customers: many(customers),
  sales: many(sales),
  serviceJobs: many(serviceJobs),
  providerBalances: many(providerBalances),
  mobileBankingTx: many(mobileBankingTx),
  recharges: many(recharges),
  onlineServices: many(onlineServices),
  expenses: many(expenses),
  dueLedger: many(dueLedger),
}));
