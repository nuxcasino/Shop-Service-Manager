import {
  Business,
  Product,
  Customer,
  ServiceJob,
  MobileBankingTx,
  RechargeTx,
  ProviderBalance,
  OnlineServiceItem,
  Expense,
  Sale,
  DueLedgerEntry
} from '@/types/shop';

export const initialBusiness: Business = {
  id: 'biz_01',
  nameBn: 'রহিম মোবাইল কেয়ার & কম্পিউটার সার্ভিস',
  nameEn: 'Rahim Mobile Care & Computer Service',
  ownerName: 'মোঃ আব্দুর রহিম',
  phone: '01712-345678',
  address: 'দোকান #১৪, হাজী মার্কেট, মিরপুর-১০ গোলচত্বর',
  district: 'ঢাকা',
  taglineBn: 'এখানে সকল প্রকার মোবাইল সার্ভিসিং, পার্টস, বিকাশ-নগদ ও কম্পিউটার সেবা প্রদান করা হয়',
  taglineEn: 'Mobile repair, accessories, mobile banking & online computer services',
  defaultLocale: 'bn',
  currency: 'BDT',
  categories: [
    'banking',
    'service',
    'computer',
    'accessories',
    'electrical',
    'seasonal',
    'pos',
    'dues'
  ],
  rates: {
    photocopyBw: 3,
    photocopyColor: 10,
    printBw: 5,
    printColor: 15,
    scanPerPage: 10,
    photoPassport4: 50,
    photoPassport8: 80,
    photoEdit: 30,
    laminationId: 15,
    laminationA4: 30
  },
  createdAt: new Date().toISOString(),
  isConfigured: true
};

export const initialProducts: Product[] = [
  {
    id: 'prod_1',
    businessId: 'biz_01',
    nameBn: 'ফাস্ট চার্জার ২০ ওয়াট (Type-C) পিডি',
    nameEn: '20W PD Fast Charger (Type-C)',
    category: 'accessories',
    buyPrice: 280,
    sellPrice: 450,
    stockQty: 24,
    unit: 'pcs',
    lowStockThreshold: 5,
    isSeasonal: false,
    supplier: 'শাহিন টেলিকম, মোতালেব প্লাজা',
    sku: 'ACC-CHG-20W',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_2',
    businessId: 'biz_01',
    nameBn: 'স্যামসাং এ১২ (A12) ডিসপ্লে ওরিজিনাল কোয়ালিটি',
    nameEn: 'Samsung A12 Display Original Combo',
    category: 'service_parts',
    buyPrice: 1200,
    sellPrice: 1800,
    stockQty: 4,
    unit: 'pcs',
    lowStockThreshold: 2,
    isSeasonal: false,
    supplier: 'মাদারবোর্ড বাজার, ইস্টার্ন প্লাজা',
    sku: 'SRV-SAM-A12',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_3',
    businessId: 'biz_01',
    nameBn: '১১ডি কিং কং ফুল গ্লু টেম্পারড গ্লাস',
    nameEn: '11D King Kong Full Glue Tempered Glass',
    category: 'accessories',
    buyPrice: 35,
    sellPrice: 100,
    stockQty: 48,
    unit: 'pcs',
    lowStockThreshold: 10,
    isSeasonal: false,
    supplier: 'চায়না এক্সেসরিজ কর্নার',
    sku: 'ACC-GLS-11D',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_4',
    businessId: 'biz_01',
    nameBn: 'ব্লুটুথ নেকব্যান্ড রিয়েলমি বাডস প্রো',
    nameEn: 'Realme Buds Wireless Neckband',
    category: 'accessories',
    buyPrice: 380,
    sellPrice: 650,
    stockQty: 8,
    unit: 'pcs',
    lowStockThreshold: 3,
    isSeasonal: false,
    supplier: 'শাহিন টেলিকম',
    sku: 'ACC-NKB-RLM',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_5',
    businessId: 'biz_01',
    nameBn: 'টাইপ-সি সুপার ফাস্ট ডেটা ক্যাবল (১ মিটার)',
    nameEn: 'Type-C Braided Fast Charging Cable 1M',
    category: 'accessories',
    buyPrice: 65,
    sellPrice: 150,
    stockQty: 32,
    unit: 'pcs',
    lowStockThreshold: 8,
    isSeasonal: false,
    supplier: 'মোতালেব প্লাজা ট্রেডার্স',
    sku: 'ACC-CBL-TYPC',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_6',
    businessId: 'biz_01',
    nameBn: 'রিম্যাক্স পাওয়ার ব্যাংক ১০০০০ এমএএইচ',
    nameEn: 'Remax 10000mAh Power Bank Dual Port',
    category: 'accessories',
    buyPrice: 850,
    sellPrice: 1250,
    stockQty: 3,
    unit: 'pcs',
    lowStockThreshold: 3,
    isSeasonal: false,
    supplier: 'গেজেট প্লাস বিডি',
    sku: 'ACC-PWB-10K',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_7',
    businessId: 'biz_01',
    nameBn: 'মাল্টিপ্লাগ ৫-পোর্ট উইথ ইন্ডিকেটর (২ মিটার)',
    nameEn: 'Multiplug 5-Port with Individual Switch',
    category: 'electrical',
    buyPrice: 220,
    sellPrice: 350,
    stockQty: 11,
    unit: 'pcs',
    lowStockThreshold: 4,
    isSeasonal: false,
    supplier: 'নবাবপুর ইলেকট্রিক স্টোর',
    sku: 'ELE-MLT-5P',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_8',
    businessId: 'biz_01',
    nameBn: '১২ ওয়াট এলইডি এনার্জি বাল্ব (সাদা আলো)',
    nameEn: '12W LED Energy Saving Bulb Daylight',
    category: 'electrical',
    buyPrice: 130,
    sellPrice: 210,
    stockQty: 2,
    unit: 'pcs',
    lowStockThreshold: 5,
    isSeasonal: false,
    supplier: 'সুপারস্টার ডিস্ট্রিবিউশন',
    sku: 'ELE-LED-12W',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_9',
    businessId: 'biz_01',
    nameBn: 'রিচার্জেবল পোর্টেবল টেবিল ফ্যান (ইউএসবি)',
    nameEn: 'Rechargeable Portable Mini Desk Fan',
    category: 'seasonal',
    buyPrice: 420,
    sellPrice: 700,
    stockQty: 6,
    unit: 'pcs',
    lowStockThreshold: 3,
    isSeasonal: true,
    season: 'summer',
    supplier: 'ইমপোর্টার্স হাব',
    sku: 'SEA-FAN-USB',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_10',
    businessId: 'biz_01',
    nameBn: 'কোয়ার্টজ রুম হিটার ৮০০ ওয়াট (ডাবল রড)',
    nameEn: 'Quartz Room Heater 800W Dual Rod',
    category: 'seasonal',
    buyPrice: 750,
    sellPrice: 1150,
    stockQty: 5,
    unit: 'pcs',
    lowStockThreshold: 2,
    isSeasonal: true,
    season: 'winter',
    supplier: 'মডার্ন হোম অ্যাপ্লায়েন্স',
    sku: 'SEA-HTR-800',
    createdAt: new Date().toISOString()
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust_1',
    businessId: 'biz_01',
    name: 'মোঃ আল-আমিন',
    phone: '01819-234567',
    address: 'সেকশন-১১, ব্লক-সি, মিরপুর',
    dueBalance: 1250,
    totalSpent: 4800,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    lastTransactionAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'cust_2',
    businessId: 'biz_01',
    name: 'কামাল হোসেন (দোকানি)',
    phone: '01711-987654',
    address: 'হাজী মার্কেট ২য় তলা',
    dueBalance: 800,
    totalSpent: 12500,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    lastTransactionAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    id: 'cust_3',
    businessId: 'biz_01',
    name: 'সুমন মিয়া',
    phone: '01912-334455',
    address: 'পল্লবী, ঢাকা',
    dueBalance: 450,
    totalSpent: 2600,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    lastTransactionAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'cust_4',
    businessId: 'biz_01',
    name: 'সেলিম রানা',
    phone: '01610-889900',
    address: 'মিরপুর-১০ গোলচত্বর',
    dueBalance: 0,
    totalSpent: 7400,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    lastTransactionAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  }
];

export const initialServiceJobs: ServiceJob[] = [
  {
    id: 'srv_1',
    ticketNo: 'TK-1001',
    businessId: 'biz_01',
    customerName: 'মোঃ আল-আমিন',
    customerPhone: '01819-234567',
    deviceBrand: 'Samsung',
    deviceModel: 'Galaxy A12',
    imei: '864209048123456',
    serviceType: 'Display/Touch/Glass',
    problemDescription: 'হাত থেকে পড়ে ডিসপ্লে সম্পূর্ণ ভেঙ্গে গেছে, আলো আসে কিন্তু টাচ কাজ করে না',
    status: 'ready',
    estimatedCost: 1800,
    finalCost: 1800,
    advancePaid: 500,
    dueAmount: 1300,
    partsUsed: [
      {
        productId: 'prod_2',
        name: 'স্যামসাং এ১২ ডিসপ্লে ওরিজিনাল',
        cost: 1200,
        price: 1500,
        qty: 1
      }
    ],
    laborCost: 300,
    notificationNote: 'ডিসপ্লে লাগানো সম্পন্ন হয়েছে, ৩ দিনের টাচ চেকিং ওয়ারেন্টি থাকবে',
    receivedDate: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    deliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    createdBy: 'মোঃ আব্দুর রহিম',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'srv_2',
    ticketNo: 'TK-1002',
    businessId: 'biz_01',
    customerName: 'তানভীর আহমেদ',
    customerPhone: '01722-112233',
    deviceBrand: 'Xiaomi',
    deviceModel: 'Redmi Note 10',
    imei: '869012345678901',
    serviceType: 'Charging Port',
    problemDescription: 'চার্জ হয় না, কেবল নাড়া দিলে মাঝে মাঝে ধরে। পিন লুজ হয়ে গেছে',
    status: 'in_progress',
    estimatedCost: 450,
    finalCost: 450,
    advancePaid: 200,
    dueAmount: 250,
    partsUsed: [
      {
        name: 'Redmi Note 10 Charging Pin Sub-board',
        cost: 120,
        price: 250,
        qty: 1
      }
    ],
    laborCost: 200,
    notificationNote: 'সোল্ডারিং ও নতুন পিন ইন্সটল করা হচ্ছে',
    receivedDate: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    createdBy: 'মোঃ আব্দুর রহিম',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString()
  },
  {
    id: 'srv_3',
    ticketNo: 'TK-1003',
    businessId: 'biz_01',
    customerName: 'জাকির হোসেন',
    customerPhone: '01988-776655',
    deviceBrand: 'Vivo',
    deviceModel: 'Y20 2021',
    imei: '861234567891234',
    serviceType: 'Lock/Unlock / FRP',
    problemDescription: 'হার্ড রিসেট দেওয়ার পর জিমেইল একাউন্ট (FRP Lock) আটকে গেছে',
    status: 'delivered',
    estimatedCost: 500,
    finalCost: 500,
    advancePaid: 500,
    dueAmount: 0,
    partsUsed: [],
    laborCost: 500,
    notificationNote: 'সফটওয়্যার টুল দিয়ে গুগল লক বাইপাস সফল হয়েছে',
    receivedDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    deliveryDate: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    createdBy: 'মোঃ আব্দুর রহিম',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    id: 'srv_4',
    ticketNo: 'TK-1004',
    businessId: 'biz_01',
    customerName: 'সুমন মিয়া',
    customerPhone: '01912-334455',
    deviceBrand: 'Realme',
    deviceModel: 'C21',
    serviceType: 'Speaker/Mic & Water Wash',
    problemDescription: 'পানিতে পড়েছিল, এরপর থেকে স্পিকারে ঘড়ঘড় শব্দ করে, কথা শোনা যায় না',
    status: 'waiting_for_parts',
    estimatedCost: 650,
    finalCost: 650,
    advancePaid: 200,
    dueAmount: 450,
    partsUsed: [],
    laborCost: 350,
    notificationNote: 'মাদারবোর্ড আল্ট্রাসনিক ওয়াশ হয়েছে, অরিজিনাল রিংগার স্পিকার অর্ডার করা হয়েছে',
    receivedDate: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    createdBy: 'মোঃ আব্দুর রহিম',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  }
];

export const initialProviderBalances: ProviderBalance[] = [
  {
    provider: 'bkash',
    openingBalance: 45000,
    currentBalance: 41850,
    targetBalance: 50000
  },
  {
    provider: 'nagad',
    openingBalance: 30000,
    currentBalance: 32400,
    targetBalance: 35000
  },
  {
    provider: 'rocket',
    openingBalance: 15000,
    currentBalance: 14200,
    targetBalance: 15000
  },
  {
    provider: 'upay',
    openingBalance: 5000,
    currentBalance: 5000,
    targetBalance: 10000
  }
];

export const initialMobileBankingTx: MobileBankingTx[] = [
  {
    id: 'mfs_1',
    businessId: 'biz_01',
    provider: 'bkash',
    type: 'cash_in',
    customerPhone: '01712-998877',
    amount: 3000,
    commission: 12.30,
    agentNumber: '01712-345678',
    txId: 'BL9X4K21P',
    note: 'কাস্টমার দোকানে নগদ ৩০০০ টাকা দিল, বিকাশ পাঠানো হলো',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'mfs_2',
    businessId: 'biz_01',
    provider: 'nagad',
    type: 'cash_out',
    customerPhone: '01822-445566',
    amount: 5000,
    commission: 20.50,
    agentNumber: '01812-345678',
    txId: 'NG8T2Y99M',
    note: 'কাস্টমার ক্যাশ আউট করল ৫০০০, দোকান থেকে নগদ টাকা পেল',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'mfs_3',
    businessId: 'biz_01',
    provider: 'rocket',
    type: 'cash_in',
    customerPhone: '01911-332211',
    amount: 1500,
    commission: 6.15,
    agentNumber: '01912-345678',
    txId: 'RK4W1L88N',
    createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString()
  }
];

export const initialRecharges: RechargeTx[] = [
  {
    id: 'rch_1',
    businessId: 'biz_01',
    operator: 'gp',
    phone: '01715-112233',
    amount: 109,
    commission: 2.85,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'rch_2',
    businessId: 'biz_01',
    operator: 'banglalink',
    phone: '01920-556677',
    amount: 298,
    commission: 7.75,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    id: 'rch_3',
    businessId: 'biz_01',
    operator: 'robi',
    phone: '01830-449911',
    amount: 50,
    commission: 1.30,
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString()
  }
];

export const initialOnlineServices: OnlineServiceItem[] = [
  {
    id: 'onl_1',
    businessId: 'biz_01',
    serviceType: 'job_app',
    customerName: 'শফিকুল ইসলাম',
    customerPhone: '01733-445566',
    govFee: 220,
    serviceCharge: 80,
    totalFee: 300,
    status: 'completed',
    trackingNumber: 'BPSC-782910',
    notes: 'বাংলাদেশ রেলওয়ে সহকারী স্টেশন মাস্টার পদে আবেদন ও এডমিট কার্ড প্রিন্ট',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 'onl_2',
    businessId: 'biz_01',
    serviceType: 'nid_service',
    customerName: 'মোছাঃ রোকেয়া বেগম',
    customerPhone: '01915-887766',
    govFee: 0,
    serviceCharge: 120,
    totalFee: 120,
    status: 'completed',
    trackingNumber: 'NID-9921029',
    notes: 'অনলাইন থেকে স্মার্ট এনআইডি কপি ডাউনলোড এবং উভয় পিঠ রঙিন লেমিনেশন',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  },
  {
    id: 'onl_3',
    businessId: 'biz_01',
    serviceType: 'birth_cert',
    customerName: 'আব্দুস সামাদ',
    customerPhone: '01811-224466',
    govFee: 100,
    serviceCharge: 100,
    totalFee: 200,
    status: 'submitted',
    trackingNumber: 'BDRIS-449182',
    notes: 'ইউনিয়ন পরিষদ জন্ম নিবন্ধন অনলাইন যাচাই ও আবেদনের হার্ডকপি প্রিন্ট',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp_1',
    businessId: 'biz_01',
    category: 'tea_snacks',
    amount: 140,
    note: 'দোকানের বিকেলের চা ও নাস্তা (কাস্টমার ও স্টাফ)',
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString()
  },
  {
    id: 'exp_2',
    businessId: 'biz_01',
    category: 'transport',
    amount: 180,
    note: 'মোতালেব প্লাজা থেকে মোবাইল ডিসপ্লে ও চার্জার আনার ভ্যান/সিএনজি ভাড়া',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString()
  },
  {
    id: 'exp_3',
    businessId: 'biz_01',
    category: 'electricity',
    amount: 1850,
    note: 'দোকানের চলতি মাসের বিদ্যুৎ বিল পরিশোধ',
    voucherNo: 'DESCO-449102',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  }
];

export const initialSales: Sale[] = [
  {
    id: 'sale_1',
    invoiceNo: 'INV-2026-001',
    businessId: 'biz_01',
    customerId: 'cust_4',
    customerName: 'সেলিম রানা',
    customerPhone: '01610-889900',
    items: [
      {
        productId: 'prod_1',
        nameBn: 'ফাস্ট চার্জার ২০ ওয়াট (Type-C) পিডি',
        nameEn: '20W PD Fast Charger (Type-C)',
        unitPrice: 450,
        buyPrice: 280,
        qty: 1,
        subtotal: 450
      },
      {
        productId: 'prod_3',
        nameBn: '১১ডি কিং কং ফুল গ্লু টেম্পারড গ্লাস',
        nameEn: '11D King Kong Full Glue Tempered Glass',
        unitPrice: 100,
        buyPrice: 35,
        qty: 1,
        subtotal: 100
      }
    ],
    subtotal: 550,
    discount: 50,
    totalAmount: 500,
    paidAmount: 500,
    dueAmount: 0,
    paymentMethod: 'cash',
    createdBy: 'মোঃ আব্দুর রহিম',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    id: 'sale_2',
    invoiceNo: 'INV-2026-002',
    businessId: 'biz_01',
    customerId: 'cust_2',
    customerName: 'কামাল হোসেন (দোকানি)',
    customerPhone: '01711-987654',
    items: [
      {
        productId: 'prod_7',
        nameBn: 'মাল্টিপ্লাগ ৫-পোর্ট উইথ ইন্ডিকেটর (২ মিটার)',
        nameEn: 'Multiplug 5-Port with Individual Switch',
        unitPrice: 350,
        buyPrice: 220,
        qty: 2,
        subtotal: 700
      },
      {
        productId: 'prod_8',
        nameBn: '১২ ওয়াট এলইডি এনার্জি বাল্ব (সাদা আলো)',
        nameEn: '12W LED Energy Saving Bulb Daylight',
        unitPrice: 210,
        buyPrice: 130,
        qty: 3,
        subtotal: 630
      }
    ],
    subtotal: 1330,
    discount: 30,
    totalAmount: 1300,
    paidAmount: 500,
    dueAmount: 800,
    paymentMethod: 'mixed',
    notes: 'নগদ ৫০০ টাকা পরিশোধ করেছেন, বাকি ৮০০ টাকা খাতায় তোলা হয়েছে',
    createdBy: 'মোঃ আব্দুর রহিম',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

export const initialDueLedger: DueLedgerEntry[] = [
  {
    id: 'due_1',
    businessId: 'biz_01',
    customerId: 'cust_2',
    customerName: 'কামাল হোসেন (দোকানি)',
    customerPhone: '01711-987654',
    relatedSaleId: 'sale_2',
    amount: 800,
    type: 'charge',
    note: 'মাল্টিপ্লাগ ও এলইডি বাল্ব ক্রয় বাবদ অবশিষ্ট বাকি',
    balanceAfter: 800,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'due_2',
    businessId: 'biz_01',
    customerId: 'cust_1',
    customerName: 'মোঃ আল-আমিন',
    customerPhone: '01819-234567',
    relatedServiceId: 'srv_1',
    amount: 1250,
    type: 'charge',
    note: 'স্যামসাং এ১২ ডিসপ্লে সার্ভিসিং ও অন্যান্য বিলের বাকি',
    balanceAfter: 1250,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString()
  }
];
