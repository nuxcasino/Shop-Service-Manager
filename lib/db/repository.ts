import { db, schema, isNeonConfigured } from '@/db';
import { eq, and, desc } from 'drizzle-orm';
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
  initialDueLedger,
} from '@/lib/seed-data';
import type {
  Business,
  Product,
  Customer,
  Sale,
  ServiceJob,
  ProviderBalance,
  MobileBankingTx,
  RechargeTx,
  OnlineServiceItem,
  Expense,
  DueLedgerEntry,
} from '@/types/shop';

// ============================================================================
// In-Memory Fallback Store (strictly isolated by userId)
// ============================================================================

interface UserDataStore {
  business: Business;
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
}

const memoryStoreByUser = new Map<string, UserDataStore>();

function getOrCreateMemoryStore(userId: string): UserDataStore {
  if (!memoryStoreByUser.has(userId)) {
    // Clone demo seed data specifically for this user
    memoryStoreByUser.set(userId, {
      business: {
        ...initialBusiness,
        id: `biz_${userId.slice(0, 8)}`,
      },
      products: initialProducts.map((p) => ({ ...p, businessId: `biz_${userId.slice(0, 8)}` })),
      customers: initialCustomers.map((c) => ({ ...c, businessId: `biz_${userId.slice(0, 8)}` })),
      sales: initialSales.map((s) => ({ ...s, businessId: `biz_${userId.slice(0, 8)}` })),
      serviceJobs: initialServiceJobs.map((j) => ({ ...j, businessId: `biz_${userId.slice(0, 8)}` })),
      providerBalances: initialProviderBalances.map((b) => ({ ...b })),
      mobileBankingTx: initialMobileBankingTx.map((m) => ({ ...m, businessId: `biz_${userId.slice(0, 8)}` })),
      recharges: initialRecharges.map((r) => ({ ...r, businessId: `biz_${userId.slice(0, 8)}` })),
      onlineServices: initialOnlineServices.map((o) => ({ ...o, businessId: `biz_${userId.slice(0, 8)}` })),
      expenses: initialExpenses.map((e) => ({ ...e, businessId: `biz_${userId.slice(0, 8)}` })),
      dueLedger: initialDueLedger.map((d) => ({ ...d, businessId: `biz_${userId.slice(0, 8)}` })),
    });
  }
  return memoryStoreByUser.get(userId)!;
}

// ============================================================================
// Repository Methods (Strict user-level data isolation on EVERY operation)
// ============================================================================

export async function getUserBootstrapData(userId: string) {
  if (isNeonConfigured && db) {
    try {
      // 1. Business Profile
      const businessRows = await db
        .select()
        .from(schema.businesses)
        .where(eq(schema.businesses.userId, userId))
        .limit(1);

      let currentBusiness: Business;
      if (businessRows.length === 0) {
        // First time user: initialize business record for this user
        const newBizId = `biz_${userId.slice(0, 8)}`;
        await db.insert(schema.businesses).values({
          id: newBizId,
          userId,
          nameBn: initialBusiness.nameBn,
          nameEn: initialBusiness.nameEn,
          ownerName: initialBusiness.ownerName,
          phone: initialBusiness.phone,
          address: initialBusiness.address,
          district: initialBusiness.district,
          taglineBn: initialBusiness.taglineBn,
          taglineEn: initialBusiness.taglineEn,
          defaultLocale: initialBusiness.defaultLocale,
          currency: initialBusiness.currency,
          categories: initialBusiness.categories,
          rates: initialBusiness.rates,
          isConfigured: true,
        });

        // Seed initial balances for the new user
        for (const b of initialProviderBalances) {
          await db.insert(schema.providerBalances).values({
            id: `${b.provider}_${userId.slice(0, 6)}`,
            userId,
            provider: b.provider,
            openingBalance: b.openingBalance,
            currentBalance: b.currentBalance,
            targetBalance: b.targetBalance || null,
          });
        }

        // Seed initial products
        for (const p of initialProducts) {
          await db.insert(schema.products).values({
            id: `${p.id}_${userId.slice(0, 6)}`,
            userId,
            businessId: newBizId,
            nameBn: p.nameBn,
            nameEn: p.nameEn,
            category: p.category,
            buyPrice: p.buyPrice,
            sellPrice: p.sellPrice,
            stockQty: p.stockQty,
            unit: p.unit || 'pcs',
            lowStockThreshold: p.lowStockThreshold,
            photoUrl: p.photoUrl || null,
            seasonalTag: p.seasonalTag || null,
            isSeasonal: p.isSeasonal || false,
            season: p.season || null,
            supplier: p.supplier || null,
            sku: p.sku || null,
          });
        }

        // Seed initial customers
        for (const c of initialCustomers) {
          await db.insert(schema.customers).values({
            id: `${c.id}_${userId.slice(0, 6)}`,
            userId,
            businessId: newBizId,
            name: c.name,
            phone: c.phone,
            address: c.address || null,
            dueBalance: c.dueBalance,
            totalSpent: c.totalSpent,
            lastTransactionAt: c.lastTransactionAt ? new Date(c.lastTransactionAt) : null,
          });
        }

        currentBusiness = {
          ...initialBusiness,
          id: newBizId,
        };
      } else {
        const b = businessRows[0];
        currentBusiness = {
          id: b.id,
          nameBn: b.nameBn,
          nameEn: b.nameEn,
          ownerName: b.ownerName,
          phone: b.phone,
          address: b.address,
          district: b.district,
          taglineBn: b.taglineBn || '',
          taglineEn: b.taglineEn || '',
          defaultLocale: (b.defaultLocale as any) || 'bn',
          currency: 'BDT',
          categories: (b.categories as string[]) || initialBusiness.categories,
          rates: (b.rates as any) || initialBusiness.rates,
          createdAt: b.createdAt.toISOString(),
          isConfigured: b.isConfigured,
        };
      }

      // Fetch all user-isolated collections
      const [
        productRows,
        customerRows,
        saleRows,
        jobRows,
        balanceRows,
        bankingRows,
        rechargeRows,
        onlineRows,
        expenseRows,
        dueRows,
      ] = await Promise.all([
        db.select().from(schema.products).where(eq(schema.products.userId, userId)),
        db.select().from(schema.customers).where(eq(schema.customers.userId, userId)),
        db.select().from(schema.sales).where(eq(schema.sales.userId, userId)).orderBy(desc(schema.sales.createdAt)),
        db.select().from(schema.serviceJobs).where(eq(schema.serviceJobs.userId, userId)).orderBy(desc(schema.serviceJobs.receivedDate)),
        db.select().from(schema.providerBalances).where(eq(schema.providerBalances.userId, userId)),
        db.select().from(schema.mobileBankingTx).where(eq(schema.mobileBankingTx.userId, userId)).orderBy(desc(schema.mobileBankingTx.createdAt)),
        db.select().from(schema.recharges).where(eq(schema.recharges.userId, userId)).orderBy(desc(schema.recharges.createdAt)),
        db.select().from(schema.onlineServices).where(eq(schema.onlineServices.userId, userId)).orderBy(desc(schema.onlineServices.createdAt)),
        db.select().from(schema.expenses).where(eq(schema.expenses.userId, userId)).orderBy(desc(schema.expenses.createdAt)),
        db.select().from(schema.dueLedger).where(eq(schema.dueLedger.userId, userId)).orderBy(desc(schema.dueLedger.createdAt)),
      ]);

      return {
        isNeon: true,
        business: currentBusiness,
        products: productRows.map((p) => ({
          ...p,
          businessId: p.businessId || currentBusiness.id,
          unit: p.unit || undefined,
          photoUrl: p.photoUrl || undefined,
          seasonalTag: (p.seasonalTag as any) || undefined,
          season: (p.season as any) || undefined,
          supplier: p.supplier || undefined,
          sku: p.sku || undefined,
          createdAt: p.createdAt.toISOString(),
        })) as Product[],
        customers: customerRows.map((c) => ({
          ...c,
          businessId: c.businessId || currentBusiness.id,
          address: c.address || undefined,
          lastTransactionAt: c.lastTransactionAt ? c.lastTransactionAt.toISOString() : undefined,
          createdAt: c.createdAt.toISOString(),
        })) as Customer[],
        sales: saleRows.map((s) => ({
          ...s,
          businessId: s.businessId || currentBusiness.id,
          items: s.items as any,
          customerId: s.customerId || undefined,
          customerPhone: s.customerPhone || undefined,
          notes: s.notes || undefined,
          createdBy: s.createdBy || 'মালিক',
          paymentMethod: s.paymentMethod as any,
          createdAt: s.createdAt.toISOString(),
        })) as Sale[],
        serviceJobs: jobRows.map((j) => ({
          ...j,
          businessId: j.businessId || currentBusiness.id,
          imei: j.imei || undefined,
          status: j.status as any,
          finalCost: j.finalCost ?? j.estimatedCost,
          partsUsed: (j.partsUsed as any) || [],
          estimatedDelivery: j.estimatedDelivery ? j.estimatedDelivery.toISOString() : undefined,
          notes: j.notes || undefined,
          notificationNote: j.notificationNote || undefined,
          receivedDate: j.receivedDate.toISOString(),
          completedDate: j.completedDate ? j.completedDate.toISOString() : undefined,
          deliveryDate: j.deliveryDate ? j.deliveryDate.toISOString() : undefined,
          createdBy: j.createdBy || 'মালিক',
          updatedAt: j.updatedAt.toISOString(),
        })) as ServiceJob[],
        providerBalances: balanceRows.map((b) => ({
          provider: b.provider as any,
          openingBalance: b.openingBalance,
          currentBalance: b.currentBalance,
          targetBalance: b.targetBalance || undefined,
        })) as ProviderBalance[],
        mobileBankingTx: bankingRows.map((m) => ({
          ...m,
          businessId: m.businessId || currentBusiness.id,
          provider: m.provider as any,
          type: m.type as any,
          agentNumber: m.agentNumber || undefined,
          txId: m.txId || undefined,
          note: m.note || undefined,
          createdAt: m.createdAt.toISOString(),
        })) as MobileBankingTx[],
        recharges: rechargeRows.map((r) => ({
          ...r,
          businessId: r.businessId || currentBusiness.id,
          operator: r.operator as any,
          isPostpaid: r.isPostpaid,
          createdAt: r.createdAt.toISOString(),
        })) as RechargeTx[],
        onlineServices: onlineRows.map((o) => ({
          ...o,
          businessId: o.businessId || currentBusiness.id,
          status: o.status as any,
          trackingNumber: o.trackingNumber || undefined,
          notes: o.notes || undefined,
          createdAt: o.createdAt.toISOString(),
        })) as OnlineServiceItem[],
        expenses: expenseRows.map((e) => ({
          ...e,
          businessId: e.businessId || currentBusiness.id,
          category: e.category as any,
          paymentMethod: (e.paymentMethod as any) || undefined,
          note: e.note || undefined,
          voucherNo: e.voucherNo || undefined,
          createdAt: e.createdAt.toISOString(),
        })) as Expense[],
        dueLedger: dueRows.map((d) => ({
          ...d,
          businessId: d.businessId || currentBusiness.id,
          relatedSaleId: d.relatedSaleId || undefined,
          relatedServiceId: d.relatedServiceId || undefined,
          type: d.type as any,
          paymentMethod: d.paymentMethod || undefined,
          createdAt: d.createdAt.toISOString(),
        })) as DueLedgerEntry[],
      };
    } catch (error) {
      console.error('Neon DB query failed, falling back to isolated store:', error);
    }
  }

  // In-memory fallback (strictly isolated by userId)
  const store = getOrCreateMemoryStore(userId);
  return {
    isNeon: false,
    ...store,
  };
}

// ----------------------------------------------------------------------------
// Create Sale with Strict Isolation & Stock Deduction
// ----------------------------------------------------------------------------
export async function createSaleInDb(userId: string, saleData: Sale) {
  if (isNeonConfigured && db) {
    try {
      await db.insert(schema.sales).values({
        id: saleData.id,
        userId,
        businessId: saleData.businessId,
        invoiceNo: saleData.invoiceNo,
        customerId: saleData.customerId || null,
        customerName: saleData.customerName,
        customerPhone: saleData.customerPhone || null,
        items: saleData.items,
        subtotal: saleData.subtotal,
        discount: saleData.discount,
        totalAmount: saleData.totalAmount,
        paidAmount: saleData.paidAmount,
        dueAmount: saleData.dueAmount,
        paymentMethod: saleData.paymentMethod,
        notes: saleData.notes || null,
        createdBy: saleData.createdBy || null,
      });

      // Deduct stock for each sold product belonging to this user
      for (const item of saleData.items) {
        const prod = await db
          .select()
          .from(schema.products)
          .where(and(eq(schema.products.id, item.productId), eq(schema.products.userId, userId)))
          .limit(1);

        if (prod.length > 0) {
          const newQty = Math.max(0, prod[0].stockQty - item.qty);
          await db
            .update(schema.products)
            .set({ stockQty: newQty, updatedAt: new Date() })
            .where(and(eq(schema.products.id, item.productId), eq(schema.products.userId, userId)));
        }
      }

      // If due amount > 0, record in customer due balance & ledger
      if (saleData.dueAmount > 0 && saleData.customerId) {
        const cust = await db
          .select()
          .from(schema.customers)
          .where(and(eq(schema.customers.id, saleData.customerId), eq(schema.customers.userId, userId)))
          .limit(1);

        if (cust.length > 0) {
          await db
            .update(schema.customers)
            .set({
              dueBalance: cust[0].dueBalance + saleData.dueAmount,
              totalSpent: cust[0].totalSpent + saleData.paidAmount,
              lastTransactionAt: new Date(),
              updatedAt: new Date(),
            })
            .where(and(eq(schema.customers.id, saleData.customerId), eq(schema.customers.userId, userId)));
        }

        await db.insert(schema.dueLedger).values({
          id: `due_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          userId,
          businessId: saleData.businessId,
          customerId: saleData.customerId,
          customerName: saleData.customerName,
          customerPhone: saleData.customerPhone || '',
          relatedSaleId: saleData.id,
          type: 'charge',
          amount: saleData.dueAmount,
          note: `ইনভয়েস ${saleData.invoiceNo} বাবদ বকেয়া`,
          balanceAfter: (cust.length > 0 ? cust[0].dueBalance : 0) + saleData.dueAmount,
        });
      }

      return { success: true };
    } catch (err) {
      console.error('Error inserting sale to Neon:', err);
    }
  }

  // Memory fallback
  const store = getOrCreateMemoryStore(userId);
  store.sales.unshift(saleData);
  saleData.items.forEach((item) => {
    const p = store.products.find((prod) => prod.id === item.productId);
    if (p) p.stockQty = Math.max(0, p.stockQty - item.qty);
  });
  return { success: true };
}

// ----------------------------------------------------------------------------
// Service Jobs
// ----------------------------------------------------------------------------
export async function createServiceJobInDb(userId: string, jobData: ServiceJob) {
  if (isNeonConfigured && db) {
    try {
      await db.insert(schema.serviceJobs).values({
        id: jobData.id,
        userId,
        businessId: jobData.businessId,
        ticketNo: jobData.ticketNo,
        customerName: jobData.customerName,
        customerPhone: jobData.customerPhone,
        deviceBrand: jobData.deviceBrand,
        deviceModel: jobData.deviceModel,
        imei: jobData.imei || null,
        serviceType: jobData.serviceType,
        problemDescription: jobData.problemDescription,
        status: jobData.status,
        estimatedCost: jobData.estimatedCost,
        finalCost: jobData.finalCost ?? jobData.estimatedCost,
        advancePaid: jobData.advancePaid,
        dueAmount: jobData.dueAmount,
        partsUsed: jobData.partsUsed || [],
        laborCost: jobData.laborCost,
        warrantyDays: jobData.warrantyDays || 0,
        estimatedDelivery: jobData.estimatedDelivery ? new Date(jobData.estimatedDelivery) : null,
        notes: jobData.notes || null,
        notificationNote: jobData.notificationNote || null,
        receivedDate: new Date(jobData.receivedDate),
        createdBy: jobData.createdBy || null,
      });
      return { success: true };
    } catch (err) {
      console.error('Error inserting service job to Neon:', err);
    }
  }

  const store = getOrCreateMemoryStore(userId);
  store.serviceJobs.unshift(jobData);
  return { success: true };
}

export async function updateServiceJobInDb(
  userId: string,
  jobId: string,
  updates: Partial<ServiceJob>
) {
  if (isNeonConfigured && db) {
    try {
      const setFields: Record<string, any> = { updatedAt: new Date() };
      if (updates.status !== undefined) setFields.status = updates.status;
      if (updates.finalCost !== undefined) setFields.finalCost = updates.finalCost;
      if (updates.advancePaid !== undefined) setFields.advancePaid = updates.advancePaid;
      if (updates.dueAmount !== undefined) setFields.dueAmount = updates.dueAmount;
      if (updates.partsUsed !== undefined) setFields.partsUsed = updates.partsUsed;
      if (updates.laborCost !== undefined) setFields.laborCost = updates.laborCost;
      if (updates.deliveryDate !== undefined) {
        setFields.deliveryDate = updates.deliveryDate ? new Date(updates.deliveryDate) : null;
      }
      if (updates.completedDate !== undefined) {
        setFields.completedDate = updates.completedDate ? new Date(updates.completedDate) : null;
      }
      if (updates.notificationNote !== undefined) setFields.notificationNote = updates.notificationNote;

      await db
        .update(schema.serviceJobs)
        .set(setFields)
        .where(and(eq(schema.serviceJobs.id, jobId), eq(schema.serviceJobs.userId, userId)));

      return { success: true };
    } catch (err) {
      console.error('Error updating service job in Neon:', err);
    }
  }

  const store = getOrCreateMemoryStore(userId);
  const idx = store.serviceJobs.findIndex((j) => j.id === jobId);
  if (idx !== -1) {
    store.serviceJobs[idx] = { ...store.serviceJobs[idx], ...updates, updatedAt: new Date().toISOString() };
  }
  return { success: true };
}

// ----------------------------------------------------------------------------
// Products CRUD
// ----------------------------------------------------------------------------
export async function upsertProductInDb(userId: string, product: Product) {
  if (isNeonConfigured && db) {
    try {
      const existing = await db
        .select()
        .from(schema.products)
        .where(and(eq(schema.products.id, product.id), eq(schema.products.userId, userId)))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(schema.products)
          .set({
            nameBn: product.nameBn,
            nameEn: product.nameEn,
            category: product.category,
            buyPrice: product.buyPrice,
            sellPrice: product.sellPrice,
            stockQty: product.stockQty,
            unit: product.unit || 'pcs',
            lowStockThreshold: product.lowStockThreshold,
            photoUrl: product.photoUrl || null,
            seasonalTag: product.seasonalTag || null,
            isSeasonal: product.isSeasonal || false,
            season: product.season || null,
            supplier: product.supplier || null,
            sku: product.sku || null,
            updatedAt: new Date(),
          })
          .where(and(eq(schema.products.id, product.id), eq(schema.products.userId, userId)));
      } else {
        await db.insert(schema.products).values({
          id: product.id,
          userId,
          businessId: product.businessId,
          nameBn: product.nameBn,
          nameEn: product.nameEn,
          category: product.category,
          buyPrice: product.buyPrice,
          sellPrice: product.sellPrice,
          stockQty: product.stockQty,
          unit: product.unit || 'pcs',
          lowStockThreshold: product.lowStockThreshold,
          photoUrl: product.photoUrl || null,
          seasonalTag: product.seasonalTag || null,
          isSeasonal: product.isSeasonal || false,
          season: product.season || null,
          supplier: product.supplier || null,
          sku: product.sku || null,
        });
      }
      return { success: true };
    } catch (err) {
      console.error('Error upserting product to Neon:', err);
    }
  }

  const store = getOrCreateMemoryStore(userId);
  const idx = store.products.findIndex((p) => p.id === product.id);
  if (idx !== -1) {
    store.products[idx] = product;
  } else {
    store.products.unshift(product);
  }
  return { success: true };
}

export async function deleteProductInDb(userId: string, productId: string) {
  if (isNeonConfigured && db) {
    try {
      await db
        .delete(schema.products)
        .where(and(eq(schema.products.id, productId), eq(schema.products.userId, userId)));
      return { success: true };
    } catch (err) {
      console.error('Error deleting product in Neon:', err);
    }
  }

  const store = getOrCreateMemoryStore(userId);
  store.products = store.products.filter((p) => p.id !== productId);
  return { success: true };
}

// ----------------------------------------------------------------------------
// Mobile Banking & Recharge
// ----------------------------------------------------------------------------
export async function recordBankingTxInDb(
  userId: string,
  txData: MobileBankingTx,
  newBalance: number
) {
  if (isNeonConfigured && db) {
    try {
      await db.insert(schema.mobileBankingTx).values({
        id: txData.id,
        userId,
        businessId: txData.businessId,
        provider: txData.provider,
        type: txData.type,
        customerPhone: txData.customerPhone,
        amount: txData.amount,
        commission: txData.commission,
        agentNumber: txData.agentNumber || null,
        txId: txData.txId || null,
        note: txData.note || null,
      });

      await db
        .update(schema.providerBalances)
        .set({ currentBalance: newBalance, lastUpdated: new Date() })
        .where(
          and(
            eq(schema.providerBalances.provider, txData.provider),
            eq(schema.providerBalances.userId, userId)
          )
        );

      return { success: true };
    } catch (err) {
      console.error('Error recording banking tx in Neon:', err);
    }
  }

  const store = getOrCreateMemoryStore(userId);
  store.mobileBankingTx.unshift(txData);
  const bal = store.providerBalances.find((b) => b.provider === txData.provider);
  if (bal) bal.currentBalance = newBalance;
  return { success: true };
}

export async function recordRechargeInDb(
  userId: string,
  rechargeData: RechargeTx,
  newBalance: number
) {
  if (isNeonConfigured && db) {
    try {
      await db.insert(schema.recharges).values({
        id: rechargeData.id,
        userId,
        businessId: rechargeData.businessId,
        operator: rechargeData.operator,
        phone: rechargeData.phone,
        amount: rechargeData.amount,
        commission: rechargeData.commission,
        isPostpaid: rechargeData.isPostpaid || false,
      });

      await db
        .update(schema.providerBalances)
        .set({ currentBalance: newBalance, lastUpdated: new Date() })
        .where(
          and(
            eq(schema.providerBalances.provider, rechargeData.operator as any),
            eq(schema.providerBalances.userId, userId)
          )
        );

      return { success: true };
    } catch (err) {
      console.error('Error recording recharge in Neon:', err);
    }
  }

  const store = getOrCreateMemoryStore(userId);
  store.recharges.unshift(rechargeData);
  return { success: true };
}

// ----------------------------------------------------------------------------
// Online Services & Expenses
// ----------------------------------------------------------------------------
export async function createOnlineServiceInDb(userId: string, item: OnlineServiceItem) {
  if (isNeonConfigured && db) {
    try {
      await db.insert(schema.onlineServices).values({
        id: item.id,
        userId,
        businessId: item.businessId,
        serviceType: item.serviceType,
        customerName: item.customerName,
        customerPhone: item.customerPhone,
        govFee: item.govFee,
        serviceCharge: item.serviceCharge,
        totalFee: item.totalFee,
        status: item.status,
        trackingNumber: item.trackingNumber || null,
        notes: item.notes || null,
      });
      return { success: true };
    } catch (err) {
      console.error('Error inserting online service in Neon:', err);
    }
  }

  const store = getOrCreateMemoryStore(userId);
  store.onlineServices.unshift(item);
  return { success: true };
}

export async function createExpenseInDb(userId: string, expense: Expense) {
  if (isNeonConfigured && db) {
    try {
      await db.insert(schema.expenses).values({
        id: expense.id,
        userId,
        businessId: expense.businessId,
        category: expense.category,
        amount: expense.amount,
        paymentMethod: expense.paymentMethod || null,
        note: expense.note || null,
        voucherNo: expense.voucherNo || null,
      });
      return { success: true };
    } catch (err) {
      console.error('Error inserting expense in Neon:', err);
    }
  }

  const store = getOrCreateMemoryStore(userId);
  store.expenses.unshift(expense);
  return { success: true };
}

// ----------------------------------------------------------------------------
// Dues Collection
// ----------------------------------------------------------------------------
export async function recordDuePaymentInDb(
  userId: string,
  entry: DueLedgerEntry,
  remainingDue: number
) {
  if (isNeonConfigured && db) {
    try {
      await db.insert(schema.dueLedger).values({
        id: entry.id,
        userId,
        businessId: entry.businessId,
        customerId: entry.customerId,
        customerName: entry.customerName,
        customerPhone: entry.customerPhone,
        relatedSaleId: entry.relatedSaleId || null,
        relatedServiceId: entry.relatedServiceId || null,
        type: entry.type,
        amount: entry.amount,
        note: entry.note,
        balanceAfter: entry.balanceAfter,
        paymentMethod: entry.paymentMethod || null,
      });

      await db
        .update(schema.customers)
        .set({
          dueBalance: remainingDue,
          lastTransactionAt: new Date(),
          updatedAt: new Date(),
        })
        .where(and(eq(schema.customers.id, entry.customerId), eq(schema.customers.userId, userId)));

      return { success: true };
    } catch (err) {
      console.error('Error recording due payment in Neon:', err);
    }
  }

  const store = getOrCreateMemoryStore(userId);
  store.dueLedger.unshift(entry);
  const cust = store.customers.find((c) => c.id === entry.customerId);
  if (cust) {
    cust.dueBalance = remainingDue;
    cust.lastTransactionAt = new Date().toISOString();
  }
  return { success: true };
}

// ----------------------------------------------------------------------------
// Update Business Settings
// ----------------------------------------------------------------------------
export async function updateBusinessInDb(userId: string, businessData: Partial<Business>) {
  if (isNeonConfigured && db) {
    try {
      const setFields: Record<string, any> = { updatedAt: new Date() };
      if (businessData.nameBn) setFields.nameBn = businessData.nameBn;
      if (businessData.nameEn) setFields.nameEn = businessData.nameEn;
      if (businessData.ownerName) setFields.ownerName = businessData.ownerName;
      if (businessData.phone) setFields.phone = businessData.phone;
      if (businessData.address) setFields.address = businessData.address;
      if (businessData.district) setFields.district = businessData.district;
      if (businessData.taglineBn !== undefined) setFields.taglineBn = businessData.taglineBn;
      if (businessData.taglineEn !== undefined) setFields.taglineEn = businessData.taglineEn;
      if (businessData.defaultLocale) setFields.defaultLocale = businessData.defaultLocale;
      if (businessData.categories) setFields.categories = businessData.categories;
      if (businessData.rates) setFields.rates = businessData.rates;
      if (businessData.isConfigured !== undefined) setFields.isConfigured = businessData.isConfigured;

      await db
        .update(schema.businesses)
        .set(setFields)
        .where(eq(schema.businesses.userId, userId));

      return { success: true };
    } catch (err) {
      console.error('Error updating business in Neon:', err);
    }
  }

  const store = getOrCreateMemoryStore(userId);
  store.business = { ...store.business, ...businessData };
  return { success: true };
}
