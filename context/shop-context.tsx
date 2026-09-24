'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Business,
  Product,
  Customer,
  Sale,
  ServiceJob,
  MobileBankingTx,
  RechargeTx,
  ProviderBalance,
  OnlineServiceItem,
  Expense,
  DueLedgerEntry,
  DuePayment,
  Locale,
  UserRole,
  PaymentMethod,
  CreateServiceJobInput,
  ServiceStatus
} from '@/types/shop';
import {
  initialBusiness,
  initialProducts,
  initialCustomers,
  initialSales,
  initialServiceJobs,
  initialProviderBalances,
  initialMobileBankingTx,
  initialRecharges,
  initialOnlineServices,
  initialExpenses,
  initialDueLedger
} from '@/lib/seed-data';
import { useSession } from '@/lib/auth-client';

export interface SessionUserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ShopContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  business: Business;
  updateBusiness: (updated: Partial<Business>) => void;
  
  // Auth & Database Session
  sessionUser: SessionUserInfo | null;
  isNeon: boolean;
  isDatabaseConnected: boolean;
  refreshUserData: () => Promise<void>;

  // Data
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  serviceJobs: ServiceJob[];
  providerBalances: ProviderBalance[];
  mobileBankingTx: MobileBankingTx[];
  recharges: RechargeTx[];
  onlineServices: OnlineServiceItem[];
  expenses: Expense[];
  dueLedger: DueLedgerEntry[];

  // Mutations
  createSale: (saleData: {
    customerId?: string;
    customerName: string;
    customerPhone?: string;
    items: Array<{ productId: string; qty: number; unitPrice: number }>;
    discount: number;
    paidAmount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Sale;
  
  createServiceJob: (jobData: CreateServiceJobInput) => ServiceJob;
  updateServiceJob: (id: string, updates: Partial<ServiceJob>) => void;
  updateServiceJobStatus: (id: string, status: ServiceStatus) => void;
  deliverServiceJob: (id: string, collectedAmount: number) => void;
  
  logMobileBankingTx: (data: Omit<MobileBankingTx, 'id' | 'businessId' | 'createdAt'>) => MobileBankingTx;
  logRechargeTx: (data: Omit<RechargeTx, 'id' | 'businessId' | 'createdAt'>) => RechargeTx;
  
  recordDuePayment: (data: { customerId: string; amount: number; paymentMethod: string; note?: string }) => void;
  createCustomer: (data: { name: string; phone: string; address?: string; initialDue?: number }) => Customer;
  
  addProduct: (product: Omit<Product, 'id' | 'businessId' | 'createdAt'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, deltaQty: number, reason?: string) => void;
  
  addExpense: (expense: Omit<Expense, 'id' | 'businessId' | 'createdAt'>) => Expense;
  logExpense: (expense: Omit<Expense, 'id' | 'businessId' | 'createdAt'>) => Expense;
  addOnlineService: (service: Omit<OnlineServiceItem, 'id' | 'businessId' | 'createdAt'>) => OnlineServiceItem;
  logOnlineService: (service: Omit<OnlineServiceItem, 'id' | 'businessId' | 'createdAt'>) => OnlineServiceItem;
  
  duePayments: DuePayment[];

  // Storage & Backup
  mounted: boolean;
  resetToDemoData: () => void;
  exportBackupJson: () => void;
  importBackupJson: (jsonData: string) => boolean;

  // Real-time calculated aggregates
  todaySalesTotal: number;
  todayServiceIncome: number;
  todayBankingCommission: number;
  todayExpensesTotal: number;
  totalCustomerDues: number;
  activeServiceJobsCount: number;
  lowStockProducts: Product[];
  currentCashInDrawer: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BUSINESS: 'dokankhata_business_v1',
  LOCALE: 'dokankhata_locale_v1',
  ROLE: 'dokankhata_role_v1',
  PRODUCTS: 'dokankhata_products_v1',
  CUSTOMERS: 'dokankhata_customers_v1',
  SALES: 'dokankhata_sales_v1',
  SERVICE_JOBS: 'dokankhata_service_jobs_v1',
  BALANCES: 'dokankhata_balances_v1',
  MFS_TX: 'dokankhata_mfs_tx_v1',
  RECHARGES: 'dokankhata_recharges_v1',
  ONLINE_SERVICES: 'dokankhata_online_services_v1',
  EXPENSES: 'dokankhata_expenses_v1',
  DUE_LEDGER: 'dokankhata_due_ledger_v1',
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [locale, setLocaleState] = useState<Locale>('bn');
  const [role, setRoleState] = useState<UserRole>('owner');
  const [business, setBusiness] = useState<Business>(initialBusiness);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [serviceJobs, setServiceJobs] = useState<ServiceJob[]>(initialServiceJobs);
  const [providerBalances, setProviderBalances] = useState<ProviderBalance[]>(initialProviderBalances);
  const [mobileBankingTx, setMobileBankingTx] = useState<MobileBankingTx[]>(initialMobileBankingTx);
  const [recharges, setRecharges] = useState<RechargeTx[]>(initialRecharges);
  const [onlineServices, setOnlineServices] = useState<OnlineServiceItem[]>(initialOnlineServices);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [dueLedger, setDueLedger] = useState<DueLedgerEntry[]>(initialDueLedger);

  // Better Auth integration
  const { data: authData } = useSession();
  const [isNeon, setIsNeon] = useState(false);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(false);

  const sessionUser = useMemo<SessionUserInfo | null>(() => {
    if (!authData || !authData.user) return null;
    return {
      id: authData.user.id,
      name: authData.user.name || '',
      email: authData.user.email || '',
      role: (authData.user as any).role || 'owner',
    };
  }, [authData]);

  // Refresh user data from server (Strict User Isolation)
  const refreshUserData = useCallback(async () => {
    try {
      const res = await fetch('/api/shop/bootstrap', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setIsDatabaseConnected(true);
          setIsNeon(Boolean(data.isNeon));
          if (data.business) setBusiness(data.business);
          if (Array.isArray(data.products)) setProducts(data.products);
          if (Array.isArray(data.customers)) setCustomers(data.customers);
          if (Array.isArray(data.sales)) setSales(data.sales);
          if (Array.isArray(data.serviceJobs)) setServiceJobs(data.serviceJobs);
          if (Array.isArray(data.providerBalances)) setProviderBalances(data.providerBalances);
          if (Array.isArray(data.mobileBankingTx)) setMobileBankingTx(data.mobileBankingTx);
          if (Array.isArray(data.recharges)) setRecharges(data.recharges);
          if (Array.isArray(data.onlineServices)) setOnlineServices(data.onlineServices);
          if (Array.isArray(data.expenses)) setExpenses(data.expenses);
          if (Array.isArray(data.dueLedger)) setDueLedger(data.dueLedger);
          return;
        }
      }
      setIsDatabaseConnected(false);
    } catch (err) {
      console.warn('Could not bootstrap from server:', err);
    }
  }, []);

  // Fetch server data when sessionUser changes
  useEffect(() => {
    let ignore = false;
    if (sessionUser) {
      void (async () => {
        if (!ignore) {
          await refreshUserData();
        }
      })();
    }
    return () => {
      ignore = true;
    };
  }, [sessionUser, refreshUserData]);

  // Load from localStorage on client mount if not authenticated yet
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedBiz = localStorage.getItem(STORAGE_KEYS.BUSINESS);
        if (storedBiz) setBusiness(JSON.parse(storedBiz));

        const storedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE) as Locale | null;
        if (storedLocale) setLocaleState(storedLocale);

        const storedRole = localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole | null;
        if (storedRole) setRoleState(storedRole);

        const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (storedProducts) setProducts(JSON.parse(storedProducts));

        const storedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
        if (storedCustomers) setCustomers(JSON.parse(storedCustomers));

        const storedSales = localStorage.getItem(STORAGE_KEYS.SALES);
        if (storedSales) setSales(JSON.parse(storedSales));

        const storedService = localStorage.getItem(STORAGE_KEYS.SERVICE_JOBS);
        if (storedService) setServiceJobs(JSON.parse(storedService));

        const storedBalances = localStorage.getItem(STORAGE_KEYS.BALANCES);
        if (storedBalances) setProviderBalances(JSON.parse(storedBalances));

        const storedMfs = localStorage.getItem(STORAGE_KEYS.MFS_TX);
        if (storedMfs) setMobileBankingTx(JSON.parse(storedMfs));

        const storedRecharges = localStorage.getItem(STORAGE_KEYS.RECHARGES);
        if (storedRecharges) setRecharges(JSON.parse(storedRecharges));

        const storedOnline = localStorage.getItem(STORAGE_KEYS.ONLINE_SERVICES);
        if (storedOnline) setOnlineServices(JSON.parse(storedOnline));

        const storedExp = localStorage.getItem(STORAGE_KEYS.EXPENSES);
        if (storedExp) setExpenses(JSON.parse(storedExp));

        const storedDue = localStorage.getItem(STORAGE_KEYS.DUE_LEDGER);
        if (storedDue) setDueLedger(JSON.parse(storedDue));
      } catch {
        // Fallback to initial seeds
      }
      setMounted(true);
      // Attempt server bootstrap if already authenticated
      void refreshUserData();
    }, 0);

    return () => clearTimeout(timer);
  }, [refreshUserData]);

  // Save changes to localStorage (client-side offline cache)
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(business));
      localStorage.setItem(STORAGE_KEYS.LOCALE, locale);
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
      localStorage.setItem(STORAGE_KEYS.SERVICE_JOBS, JSON.stringify(serviceJobs));
      localStorage.setItem(STORAGE_KEYS.BALANCES, JSON.stringify(providerBalances));
      localStorage.setItem(STORAGE_KEYS.MFS_TX, JSON.stringify(mobileBankingTx));
      localStorage.setItem(STORAGE_KEYS.RECHARGES, JSON.stringify(recharges));
      localStorage.setItem(STORAGE_KEYS.ONLINE_SERVICES, JSON.stringify(onlineServices));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      localStorage.setItem(STORAGE_KEYS.DUE_LEDGER, JSON.stringify(dueLedger));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [
    mounted,
    business,
    locale,
    role,
    products,
    customers,
    sales,
    serviceJobs,
    providerBalances,
    mobileBankingTx,
    recharges,
    onlineServices,
    expenses,
    dueLedger
  ]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (mounted) localStorage.setItem(STORAGE_KEYS.LOCALE, newLocale);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (mounted) localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
  };

  const updateBusiness = (updated: Partial<Business>) => {
    setBusiness((prev) => ({ ...prev, ...updated }));
    if (sessionUser) {
      fetch('/api/shop/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(console.error);
    }
  };

  // Create Sale with atomic stock deduction and due updates
  const createSale = ({
    customerId,
    customerName,
    customerPhone,
    items,
    discount,
    paidAmount,
    paymentMethod,
    notes
  }: {
    customerId?: string;
    customerName: string;
    customerPhone?: string;
    items: Array<{ productId: string; qty: number; unitPrice: number }>;
    discount: number;
    paidAmount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Sale => {
    const saleId = `sale_${Date.now()}`;
    const invoiceNo = `INV-${new Date().getFullYear()}-${String(sales.length + 1).padStart(3, '0')}`;

    // Map item details and calculate subtotal
    const detailedItems = items.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        nameBn: prod?.nameBn || 'অজ্ঞাত পণ্য',
        nameEn: prod?.nameEn || 'Unknown item',
        unitPrice: item.unitPrice,
        buyPrice: prod?.buyPrice || 0,
        qty: item.qty,
        subtotal: item.unitPrice * item.qty
      };
    });

    const subtotal = detailedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const totalAmount = Math.max(0, subtotal - discount);
    const dueAmount = Math.max(0, totalAmount - paidAmount);

    // Deduct stock for all items
    setProducts((prev) =>
      prev.map((p) => {
        const matchingItem = items.find((i) => i.productId === p.id);
        if (matchingItem) {
          return {
            ...p,
            stockQty: Math.max(0, p.stockQty - matchingItem.qty)
          };
        }
        return p;
      })
    );

    // Handle Customer record and Due ledger if due > 0
    let resolvedCustomerId = customerId;
    if (dueAmount > 0 || customerPhone) {
      if (customerId) {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === customerId
              ? {
                  ...c,
                  dueBalance: c.dueBalance + dueAmount,
                  totalSpent: c.totalSpent + paidAmount,
                  lastTransactionAt: new Date().toISOString()
                }
              : c
          )
        );
      } else if (customerName) {
        // Create new customer
        const newCustId = `cust_${Date.now()}`;
        resolvedCustomerId = newCustId;
        const newCustomer: Customer = {
          id: newCustId,
          businessId: business.id,
          name: customerName,
          phone: customerPhone || '',
          dueBalance: dueAmount,
          totalSpent: paidAmount,
          createdAt: new Date().toISOString(),
          lastTransactionAt: new Date().toISOString()
        };
        setCustomers((prev) => [newCustomer, ...prev]);
      }

      if (dueAmount > 0 && resolvedCustomerId) {
        const existingCust = customers.find((c) => c.id === resolvedCustomerId);
        const prevBal = existingCust ? existingCust.dueBalance : 0;
        const newDueEntry: DueLedgerEntry = {
          id: `due_${Date.now()}`,
          businessId: business.id,
          customerId: resolvedCustomerId,
          customerName,
          customerPhone: customerPhone || '',
          relatedSaleId: saleId,
          amount: dueAmount,
          type: 'charge',
          note: `ইনভয়েস ${invoiceNo} বাবদ বকেয়া`,
          balanceAfter: prevBal + dueAmount,
          createdAt: new Date().toISOString()
        };
        setDueLedger((prev) => [newDueEntry, ...prev]);
      }
    }

    const newSale: Sale = {
      id: saleId,
      invoiceNo,
      businessId: business.id,
      customerId: resolvedCustomerId,
      customerName,
      customerPhone,
      items: detailedItems,
      subtotal,
      discount,
      totalAmount,
      paidAmount,
      dueAmount,
      paymentMethod,
      notes,
      createdBy: role === 'owner' ? business.ownerName : 'স্টাফ',
      createdAt: new Date().toISOString()
    };

    setSales((prev) => [newSale, ...prev]);

    // Server-side persistence with strict user isolation
    if (sessionUser) {
      fetch('/api/shop/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSale),
      }).catch(console.error);
    }

    return newSale;
  };

  // Create Service Job Ticket
  const createServiceJob = (jobData: CreateServiceJobInput): ServiceJob => {
    const id = `srv_${Date.now()}`;
    const ticketNo = `TK-${1000 + serviceJobs.length + 1}`;
    
    // If parts were selected from inventory products, deduct stock
    if (jobData.partsUsed && jobData.partsUsed.length > 0) {
      setProducts((prev) =>
        prev.map((p) => {
          const usedPart = jobData.partsUsed?.find((part) => part.productId === p.id);
          if (usedPart) {
            return { ...p, stockQty: Math.max(0, p.stockQty - usedPart.qty) };
          }
          return p;
        })
      );
    }

    const estimatedDeliveryStr = jobData.estimatedDelivery instanceof Date
      ? jobData.estimatedDelivery.toISOString()
      : jobData.estimatedDelivery;

    const newJob: ServiceJob = {
      id,
      ticketNo,
      businessId: business.id,
      customerName: jobData.customerName,
      customerPhone: jobData.customerPhone,
      deviceBrand: jobData.deviceBrand,
      deviceModel: jobData.deviceModel,
      imei: jobData.imei,
      serviceType: jobData.serviceType,
      problemDescription: jobData.problemDescription,
      status: jobData.status || 'received',
      estimatedCost: jobData.estimatedCost,
      finalCost: jobData.finalCost ?? jobData.estimatedCost,
      advancePaid: jobData.advancePaid,
      dueAmount: jobData.dueAmount ?? Math.max(0, jobData.estimatedCost - jobData.advancePaid),
      partsUsed: jobData.partsUsed || [],
      laborCost: jobData.laborCost || 0,
      warrantyDays: jobData.warrantyDays,
      estimatedDelivery: estimatedDeliveryStr,
      notes: jobData.notes,
      receivedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: role === 'owner' ? business.ownerName : 'স্টাফ'
    };

    setServiceJobs((prev) => [newJob, ...prev]);

    // Server-side persistence
    if (sessionUser) {
      fetch('/api/shop/service-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      }).catch(console.error);
    }

    return newJob;
  };

  const updateServiceJob = (id: string, updates: Partial<ServiceJob>) => {
    setServiceJobs((prev) =>
      prev.map((job) => {
        if (job.id === id) {
          const updated = {
            ...job,
            ...updates,
            updatedAt: new Date().toISOString()
          };
          return updated;
        }
        return job;
      })
    );

    if (sessionUser) {
      fetch('/api/shop/service-jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      }).catch(console.error);
    }
  };

  const updateServiceJobStatus = (id: string, status: ServiceStatus) => {
    updateServiceJob(id, {
      status,
      completedDate: status === 'ready' || status === 'delivered' ? new Date().toISOString() : undefined,
      deliveryDate: status === 'delivered' ? new Date().toISOString() : undefined
    });
  };

  const deliverServiceJob = (id: string, collectedAmount: number) => {
    const job = serviceJobs.find((j) => j.id === id);
    if (!job) return;

    updateServiceJob(id, {
      status: 'delivered',
      deliveryDate: new Date().toISOString(),
      advancePaid: job.advancePaid + collectedAmount
    });
  };

  // Mobile Banking Cash In / Out
  const logMobileBankingTx = (
    data: Omit<MobileBankingTx, 'id' | 'businessId' | 'createdAt'>
  ): MobileBankingTx => {
    const id = `mfs_${Date.now()}`;
    const newTx: MobileBankingTx = {
      ...data,
      id,
      businessId: business.id,
      createdAt: new Date().toISOString()
    };

    let calculatedNewBalance = 0;
    setProviderBalances((prev) =>
      prev.map((pb) => {
        if (pb.provider === data.provider) {
          const delta = data.type === 'cash_in' ? -data.amount : data.amount;
          calculatedNewBalance = pb.currentBalance + delta;
          return {
            ...pb,
            currentBalance: calculatedNewBalance
          };
        }
        return pb;
      })
    );

    setMobileBankingTx((prev) => [newTx, ...prev]);

    if (sessionUser) {
      fetch('/api/shop/banking-tx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx: newTx, newBalance: calculatedNewBalance }),
      }).catch(console.error);
    }

    return newTx;
  };

  // Mobile Recharge
  const logRechargeTx = (
    data: Omit<RechargeTx, 'id' | 'businessId' | 'createdAt'>
  ): RechargeTx => {
    const id = `rch_${Date.now()}`;
    const newTx: RechargeTx = {
      ...data,
      id,
      businessId: business.id,
      createdAt: new Date().toISOString()
    };
    setRecharges((prev) => [newTx, ...prev]);

    if (sessionUser) {
      fetch('/api/shop/recharges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recharge: newTx, newBalance: 0 }),
      }).catch(console.error);
    }

    return newTx;
  };

  // Record Due Payment (আদায়)
  const recordDuePayment = ({
    customerId,
    amount,
    paymentMethod,
    note
  }: {
    customerId: string;
    amount: number;
    paymentMethod: string;
    note?: string;
  }) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;

    const newBalance = Math.max(0, cust.dueBalance - amount);

    // Update customer record
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              dueBalance: newBalance,
              totalSpent: c.totalSpent + amount,
              lastTransactionAt: new Date().toISOString()
            }
          : c
      )
    );

    // Create Due Ledger record
    const entry: DueLedgerEntry = {
      id: `due_pay_${Date.now()}`,
      businessId: business.id,
      customerId,
      customerName: cust.name,
      customerPhone: cust.phone,
      amount: -amount, // negative indicates payment
      type: 'payment',
      paymentMethod,
      note: note || `বাকি টাকা পরিশোধ আদায় (${paymentMethod})`,
      balanceAfter: newBalance,
      createdAt: new Date().toISOString()
    };

    setDueLedger((prev) => [entry, ...prev]);

    if (sessionUser) {
      fetch('/api/shop/dues/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry, remainingDue: newBalance }),
      }).catch(console.error);
    }
  };

  const createCustomer = ({
    name,
    phone,
    address,
    initialDue = 0
  }: {
    name: string;
    phone: string;
    address?: string;
    initialDue?: number;
  }): Customer => {
    const newCust: Customer = {
      id: `cust_${Date.now()}`,
      businessId: business.id,
      name,
      phone,
      address,
      dueBalance: initialDue,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      lastTransactionAt: new Date().toISOString()
    };

    setCustomers((prev) => [newCust, ...prev]);

    if (initialDue > 0) {
      const entry: DueLedgerEntry = {
        id: `due_init_${Date.now()}`,
        businessId: business.id,
        customerId: newCust.id,
        customerName: name,
        customerPhone: phone,
        amount: initialDue,
        type: 'charge',
        note: 'প্রারম্ভিক পূর্বের বাকি খাতা এন্ট্রি',
        balanceAfter: initialDue,
        createdAt: new Date().toISOString()
      };
      setDueLedger((prev) => [entry, ...prev]);
    }

    return newCust;
  };

  // Product mutations
  const addProduct = (
    product: Omit<Product, 'id' | 'businessId' | 'createdAt'>
  ): Product => {
    const newProd: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      businessId: business.id,
      createdAt: new Date().toISOString()
    };
    setProducts((prev) => [newProd, ...prev]);

    if (sessionUser) {
      fetch('/api/shop/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      }).catch(console.error);
    }

    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    let updatedProd: Product | null = null;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          updatedProd = { ...p, ...updates };
          return updatedProd;
        }
        return p;
      })
    );

    if (sessionUser && updatedProd) {
      fetch('/api/shop/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProd),
      }).catch(console.error);
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    if (sessionUser) {
      fetch('/api/shop/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).catch(console.error);
    }
  };

  const adjustStock = (id: string, deltaQty: number) => {
    let targetProd: Product | null = null;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQty = Math.max(0, p.stockQty + deltaQty);
          targetProd = { ...p, stockQty: newQty };
          return targetProd;
        }
        return p;
      })
    );

    if (sessionUser && targetProd) {
      fetch('/api/shop/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetProd),
      }).catch(console.error);
    }
  };

  // Expense mutation
  const addExpense = (
    expense: Omit<Expense, 'id' | 'businessId' | 'createdAt'>
  ): Expense => {
    const newExp: Expense = {
      ...expense,
      id: `exp_${Date.now()}`,
      businessId: business.id,
      createdAt: new Date().toISOString()
    };
    setExpenses((prev) => [newExp, ...prev]);

    if (sessionUser) {
      fetch('/api/shop/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp),
      }).catch(console.error);
    }

    return newExp;
  };

  // Online Service mutation
  const addOnlineService = (
    service: Omit<OnlineServiceItem, 'id' | 'businessId' | 'createdAt'>
  ): OnlineServiceItem => {
    const newService: OnlineServiceItem = {
      ...service,
      id: `onl_${Date.now()}`,
      businessId: business.id,
      createdAt: new Date().toISOString()
    };
    setOnlineServices((prev) => [newService, ...prev]);

    if (sessionUser) {
      fetch('/api/shop/online-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      }).catch(console.error);
    }

    return newService;
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    setBusiness(initialBusiness);
    setProducts(initialProducts);
    setCustomers(initialCustomers);
    setSales(initialSales);
    setServiceJobs(initialServiceJobs);
    setProviderBalances(initialProviderBalances);
    setMobileBankingTx(initialMobileBankingTx);
    setRecharges(initialRecharges);
    setOnlineServices(initialOnlineServices);
    setExpenses(initialExpenses);
    setDueLedger(initialDueLedger);
    localStorage.clear();
  };

  // Export JSON
  const exportBackupJson = () => {
    const backupData = {
      business,
      products,
      customers,
      sales,
      serviceJobs,
      providerBalances,
      mobileBankingTx,
      recharges,
      onlineServices,
      expenses,
      dueLedger,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dokankhata_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJson = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.business) setBusiness(data.business);
      if (Array.isArray(data.products)) setProducts(data.products);
      if (Array.isArray(data.customers)) setCustomers(data.customers);
      if (Array.isArray(data.sales)) setSales(data.sales);
      if (Array.isArray(data.serviceJobs)) setServiceJobs(data.serviceJobs);
      if (Array.isArray(data.providerBalances)) setProviderBalances(data.providerBalances);
      if (Array.isArray(data.mobileBankingTx)) setMobileBankingTx(data.mobileBankingTx);
      if (Array.isArray(data.recharges)) setRecharges(data.recharges);
      if (Array.isArray(data.onlineServices)) setOnlineServices(data.onlineServices);
      if (Array.isArray(data.expenses)) setExpenses(data.expenses);
      if (Array.isArray(data.dueLedger)) setDueLedger(data.dueLedger);
      return true;
    } catch {
      return false;
    }
  };

  // Live aggregates
  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const todaySalesTotal = useMemo(() => {
    return sales
      .filter((s) => isToday(s.createdAt))
      .reduce((sum, s) => sum + s.totalAmount, 0);
  }, [sales]);

  const todayServiceIncome = useMemo(() => {
    return serviceJobs
      .filter((j) => isToday(j.receivedDate) || (j.deliveryDate && isToday(j.deliveryDate)))
      .reduce((sum, j) => sum + (j.status === 'delivered' ? j.finalCost : j.advancePaid), 0);
  }, [serviceJobs]);

  const todayBankingCommission = useMemo(() => {
    const mfsComm = mobileBankingTx
      .filter((t) => isToday(t.createdAt))
      .reduce((sum, t) => sum + t.commission, 0);
    const rchComm = recharges
      .filter((r) => isToday(r.createdAt))
      .reduce((sum, r) => sum + r.commission, 0);
    return Math.round((mfsComm + rchComm) * 100) / 100;
  }, [mobileBankingTx, recharges]);

  const todayExpensesTotal = useMemo(() => {
    return expenses
      .filter((e) => isToday(e.createdAt))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const totalCustomerDues = useMemo(() => {
    return customers.reduce((sum, c) => sum + Math.max(0, c.dueBalance), 0);
  }, [customers]);

  const activeServiceJobsCount = useMemo(() => {
    return serviceJobs.filter((j) => j.status !== 'delivered' && j.status !== 'cancelled').length;
  }, [serviceJobs]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stockQty <= p.lowStockThreshold);
  }, [products]);

  // Cash in drawer estimation for today:
  const currentCashInDrawer = useMemo(() => {
    const cashSales = sales
      .filter((s) => s.paymentMethod === 'cash' || s.paymentMethod === 'mixed')
      .reduce((sum, s) => sum + s.paidAmount, 0);

    const mfsCashInTaken = mobileBankingTx
      .filter((t) => t.type === 'cash_in')
      .reduce((sum, t) => sum + t.amount, 0);

    const mfsCashOutGiven = mobileBankingTx
      .filter((t) => t.type === 'cash_out')
      .reduce((sum, t) => sum + t.amount, 0);

    const dueCashCollected = dueLedger
      .filter((d) => d.type === 'payment')
      .reduce((sum, d) => sum + Math.abs(d.amount), 0);

    const expensesPaid = expenses.reduce((sum, e) => sum + e.amount, 0);

    return Math.max(0, 15000 + cashSales + mfsCashInTaken - mfsCashOutGiven + dueCashCollected - expensesPaid);
  }, [sales, mobileBankingTx, dueLedger, expenses]);

  const duePayments = useMemo<DuePayment[]>(() => {
    return dueLedger
      .filter((d) => d.type === 'payment')
      .map((d) => ({
        id: d.id,
        businessId: d.businessId,
        customerId: d.customerId,
        amount: Math.abs(d.amount),
        paymentMethod: (d.paymentMethod as PaymentMethod) || 'cash',
        collectedBy: 'Owner',
        createdAt: d.createdAt,
        notes: d.note
      }));
  }, [dueLedger]);

  return (
    <ShopContext.Provider
      value={{
        locale,
        setLocale,
        role,
        setRole,
        business,
        updateBusiness,
        sessionUser,
        isNeon,
        isDatabaseConnected,
        refreshUserData,
        products,
        customers,
        sales,
        serviceJobs,
        providerBalances,
        mobileBankingTx,
        recharges,
        onlineServices,
        expenses,
        dueLedger,
        duePayments,
        createSale,
        createServiceJob,
        updateServiceJob,
        updateServiceJobStatus,
        deliverServiceJob,
        logMobileBankingTx,
        logRechargeTx,
        recordDuePayment,
        createCustomer,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        addExpense,
        logExpense: addExpense,
        addOnlineService,
        logOnlineService: addOnlineService,
        mounted,
        resetToDemoData,
        exportBackupJson,
        importBackupJson,
        todaySalesTotal,
        todayServiceIncome,
        todayBankingCommission,
        todayExpensesTotal,
        totalCustomerDues,
        activeServiceJobsCount,
        lowStockProducts,
        currentCashInDrawer
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
