import { Locale } from '@/types/shop';

export const toBanglaNumber = (num: number | string): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit, 10)]);
};

export const formatCurrency = (amount: number, locale: Locale = 'bn'): string => {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('en-IN').format(rounded);
  
  if (locale === 'bn') {
    return `৳${toBanglaNumber(formatted)}`;
  }
  return `৳${formatted}`;
};

export const formatDate = (
  dateStr: string | Date,
  locale: Locale = 'bn',
  includeTime: boolean = false
): string => {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  
  if (isNaN(date.getTime())) return '';

  const bnMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const enMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  let timeString = '';
  if (includeTime) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? (locale === 'bn' ? 'দুপুর/রাত' : 'PM') : (locale === 'bn' ? 'সকাল' : 'AM');
    hours = hours % 12 || 12;
    
    if (locale === 'bn') {
      timeString = ` ${ampm} ${toBanglaNumber(hours)}:${toBanglaNumber(minutes)}`;
    } else {
      timeString = ` ${hours}:${minutes} ${ampm}`;
    }
  }

  if (locale === 'bn') {
    return `${toBanglaNumber(day)} ${bnMonths[month]} ${toBanglaNumber(year)}${timeString}`;
  }

  return `${day} ${enMonths[month]} ${year}${timeString}`;
};

export const translations = {
  bn: {
    // App & Brand
    app_title: 'দোকান খাতা প্রো',
    app_subtitle: 'স্মার্ট শপ & সার্ভিস ম্যানেজমেন্ট',
    demo_badge: 'ডেমো মোড',
    language: 'ভাষা',
    bangla: 'বাংলা',
    english: 'English',
    owner: 'মালিক (Owner)',
    staff: 'কর্মচারী (Staff)',
    role: 'ভূমিকা',
    switch_role: 'রোল পরিবর্তন করুন',
    
    // Navigation
    nav_dashboard: 'ড্যাশবোর্ড',
    nav_pos: 'বিক্রয় ও ক্যাশ মেমো',
    nav_banking: 'মোবাইল ব্যাংকিং ও রিচার্জ',
    nav_service: 'মোবাইল সার্ভিসিং',
    nav_computer: 'ফটোকপি ও অনলাইন সেবা',
    nav_inventory: 'স্টক ও পণ্য তালিকা',
    nav_dues: 'বাকি খাতা (কাস্টমার ডিউ)',
    nav_expenses: 'দোকান খরচ',
    nav_reports: 'হিসাব ও রিপোর্ট',
    nav_settings: 'দোকান সেটিংস',

    // Quick Actions
    quick_new_sale: 'নতুন বিক্রয় (POS)',
    quick_new_service: 'নতুন সার্ভিস টিকিট',
    quick_cash_in: 'ক্যাশ ইন / আউট',
    quick_record_due: 'বাকি আদায় / এন্ট্রি',
    quick_new_expense: 'খরচ এন্ট্রি',
    quick_actions: 'দ্রুত অ্যাকশন',

    // Dashboard
    today_summary: 'আজকের সামগ্রিক হিসাব',
    today_sales: 'আজকের পণ্য বিক্রয়',
    today_service_income: 'আজকের সার্ভিসিং আয়',
    today_banking_commission: 'ব্যাংকিং ও রিচার্জ কমিশন',
    today_expenses: 'আজকের মোট খরচ',
    cash_in_drawer: 'ক্যাশ ড্রয়ারে বর্তমান ক্যাশ',
    pending_jobs: 'চলমান সার্ভিস টিকিট',
    low_stock_items: 'লো স্টক সতর্কতা',
    total_customer_due: 'মোট কাস্টমার বাকি (পাওনা)',
    recent_activities: 'সাম্প্রতিক লেনদেনসমূহ',
    cash_flow_title: 'আজকের ক্যাশ ফ্লো সারাংশ',
    
    // POS / Sales
    search_product_placeholder: 'পণ্য বা বারকোড খুঁজুন...',
    all_categories: 'সব ক্যাটাগরি',
    cart: 'বিলিং কার্ট',
    cart_empty: 'কার্ট খালি! পণ্য যোগ করতে ক্লিক করুন',
    unit_price: 'দর',
    qty: 'পরিমাণ',
    subtotal: 'সাব-টোটাল',
    discount: 'ছাড় (Discount)',
    total: 'সর্বমোট',
    payment_method: 'পরিশোধের মাধ্যম',
    paid_amount: 'পরিশোধিত টাকা',
    due_amount: 'বাকি টাকা',
    change_amount: 'ফেরত টাকা',
    customer_info: 'গ্রাহক তথ্য (ঐচ্ছিক/বাকির জন্য আবশ্যক)',
    customer_name: 'গ্রাহকের নাম',
    customer_phone: 'মোবাইল নম্বর',
    customer_address: 'ঠিকানা',
    select_customer: 'নিয়মিত গ্রাহক নির্বাচন করুন',
    complete_sale: 'বিক্রয় সম্পন্ন করুন (মেমো)',
    cash: 'নগদ ক্যাশ',
    bkash: 'বিকাশ',
    nagad: 'নগদ',
    rocket: 'রকেট',
    due: 'সম্পূর্ণ বাকি',
    sale_success: 'বিক্রয় সফল হয়েছে!',
    print_invoice: 'ক্যাশ মেমো প্রিন্ট করুন',
    thermal_print: 'থার্মাল প্রিন্ট (80mm)',
    standard_print: 'স্ট্যান্ডার্ড A4/A5 মেমো',

    // Mobile Banking & Recharge
    mfs_title: 'বিকাশ, নগদ ও রকেট হিসাব খাতা',
    cash_in: 'ক্যাশ ইন (Cash In)',
    cash_out: 'ক্যাশ আউট (Cash Out)',
    agent_number: 'এজেন্ট নম্বর',
    customer_number: 'গ্রাহকের নম্বর',
    amount: 'টাকার পরিমাণ',
    commission: 'অর্জিত কমিশন',
    current_float: 'বর্তমান ই-ব্যালেন্স',
    opening_balance: 'দিনের শুরুর ব্যালেন্স',
    provider: 'সার্ভিস প্রোভাইডার',
    recharge_title: 'মোবাইল রিচার্জ (ফ্লেক্সিলোড)',
    operator: 'অপারেটর',
    prepaid: 'প্রিপেইড',
    postpaid: 'পোস্টপেইড',
    submit_tx: 'লেনদেন নিশ্চিত করুন',
    tx_history: 'আজকের লেনদেন তালিকা',
    float_reconciliation: 'দৈনিক ব্যালেন্স সমন্বয়',

    // Mobile Servicing
    service_title: 'মোবাইল সার্ভিসিং জব টিকিট',
    new_ticket: 'নতুন সার্ভিস টিকিট গ্রহণ',
    ticket_no: 'টিকেট নং',
    device_brand: 'ব্র্যান্ড / কোম্পানি',
    device_model: 'মডেল',
    imei_serial: 'IMEI / সিরিয়াল নম্বর (ঐচ্ছিক)',
    problem_type: 'সমস্যার ধরণ',
    problem_desc: 'সমস্যার বিস্তারিত বিবরণ',
    estimated_cost: 'সম্ভাব্য বিল (৳)',
    final_cost: 'চূড়ান্ত বিল (৳)',
    advance_paid: 'অগ্রিম জমা (৳)',
    labor_charge: 'সার্ভিস চার্জ / মজুরি',
    parts_used: 'ব্যবহৃত পার্টস / সরঞ্জাম',
    status: 'অবস্থা',
    status_received: 'গৃহীত (Received)',
    status_in_progress: 'কাজ চলছে (In Progress)',
    status_waiting_for_parts: 'যন্ত্রাংশের অপেক্ষা (Waiting Parts)',
    status_ready: 'ডেলিভারির জন্য প্রস্তুত (Ready)',
    status_delivered: 'ডেলিভারি সম্পন্ন (Delivered)',
    status_cancelled: 'বাতিল (Cancelled)',
    print_job_slip: 'কাস্টমার রিসিট প্রিন্ট',
    search_ticket: 'নাম, মোবাইল বা টিকিট নং খুঁজুন...',
    update_status: 'অবস্থা পরিবর্তন করুন',
    customer_note_field: 'ডেলিভারি নোট / ওয়ারেন্টি বার্তা',

    // Computer & Online Service
    computer_title: 'ফটোকপি, প্রিন্ট ও অনলাইন সরকারি সেবা',
    counter_billing: 'ফটোকপি ও প্রিন্ট দ্রুত কাউন্টার',
    photocopy_bw: 'ফটোকপি (সাদা-কালো)',
    photocopy_color: 'ফটোকপি (রঙিন)',
    print_bw: 'কম্পিউটার প্রিন্ট (B/W)',
    print_color: 'রঙিন প্রিন্ট (Color)',
    document_scan: 'ডকুমেন্ট স্ক্যান',
    passport_photo_4: 'পাসপোর্ট ছবি (৪ কপি)',
    passport_photo_8: 'পাসপোর্ট ছবি (৮ কপি)',
    photo_edit: 'ছবি ব্যাকগ্রাউন্ড এডিট',
    lamination_id: 'লেমিনেশন (আইডি কার্ড)',
    lamination_a4: 'লেমিনেশন (A4 সাইজ)',
    quick_add_counter: 'কাউন্টারে যোগ',
    online_service_log: 'অনলাইন আবেদন ও সরকারি সেবার খাতা',
    service_type: 'সেবার ধরণ',
    gov_fee: 'সরকারি ফি',
    service_charge: 'দোকান চার্জ',
    tracking_no: 'ট্র্যাকিং / রোল নম্বর',
    job_application: 'চাকরির আবেদন',
    admission_form: 'স্কুল/কলেজ ভর্তি আবেদন',
    birth_cert: 'জন্ম নিবন্ধন আবেদন/সংশোধন',
    nid_service: 'জাতীয় পরিচয়পত্র (NID) সেবা',
    passport_form: 'পাসপোর্ট আবেদন',
    bill_payment: 'পল্লী বিদ্যুৎ ও গ্যাস বিল',

    // Inventory
    inventory_title: 'পণ্য স্টক ও ইনভেন্টরি ম্যানেজমেন্ট',
    add_product: 'নতুন পণ্য যোগ করুন',
    product_name_bn: 'পণ্যের নাম (বাংলা)',
    product_name_en: 'পণ্যের নাম (English)',
    category: 'ক্যাটাগরি',
    buy_price: 'ক্রয় মূল্য (৳)',
    sell_price: 'বিক্রয় মূল্য (৳)',
    stock_qty: 'বর্তমান স্টক',
    unit: 'একক (Unit)',
    low_stock_limit: 'লো স্টক অ্যালার্ট সীমা',
    seasonal_product: 'মৌসুমি পণ্য?',
    season_all: 'সব ঋতুতে চলে',
    season_summer: 'গ্রীষ্মকালীন',
    season_winter: 'শীতকালীন',
    supplier: 'সরবরাহকারী / মহাজন',
    stock_status: 'স্টকের অবস্থা',
    in_stock: 'স্টক পর্যাপ্ত',
    low_stock: 'স্টক কম',
    out_of_stock: 'স্টক শেষ!',
    adjust_stock: 'স্টক বাড়ানো / কমানো',
    pcs: 'টি (Pcs)',
    box: 'বক্স (Box)',
    meter: 'মিটার (Meter)',

    // Dues
    dues_title: 'বাকি খাতা (Customer Credit Ledger)',
    customer_directory: 'গ্রাহকদের বাকির তালিকা',
    total_due_amount: 'মোট পাওনা টাকা',
    total_due_customers: 'বাকি থাকা গ্রাহক সংখ্যা',
    add_new_customer: 'নতুন গ্রাহক যুক্ত করুন',
    due_history: 'বাকির ইতিহাস ও লেনদেন',
    record_due_payment: 'বাকি টাকা জমা নিন (আদায়)',
    collect_due: 'বাকি আদায়',
    collected_amount: 'আদায়কৃত টাকা (৳)',
    send_reminder: 'তাগাদা / SMS পাঠান',
    sms_reminder_template: 'বাকি পরিশোধের তাগাদা বার্তা',
    copy_sms: 'মেসেজ কপি করুন',
    open_whatsapp: 'হোয়াটসঅ্যাপে পাঠান',
    no_dues: 'কোনো বাকি নেই!',

    // Expenses
    expenses_title: 'দোকানের দৈনন্দিন খরচ খাতা',
    add_expense: 'নতুন খরচ লিখুন',
    expense_category: 'খরচের খাত',
    expense_rent: 'দোকান ভাড়া',
    expense_electricity: 'বিদ্যুৎ বিল',
    expense_salary: 'কর্মচারীর বেতন',
    expense_tea_snacks: 'নাস্তা ও আপ্যায়ন',
    expense_transport: 'মাল আনা-নেওয়া / যাতায়াত',
    expense_tools: 'সার্ভিসিং যন্ত্রপাতি ক্রয়',
    expense_internet: 'ইন্টারনেট বিল',
    expense_misc: 'অন্যান্য আনুষঙ্গিক খরচ',
    note: 'মন্তব্য / বিবরণ',
    voucher_no: 'ভাউচার / মেমো নং',

    // Reports
    reports_title: 'হিসাব-নিকাশ ও ব্যবসায়িক রিপোর্ট',
    period_today: 'আজকের হিসাব',
    period_yesterday: 'গতকালের হিসাব',
    period_7days: 'গত ৭ দিন',
    period_this_month: 'চলতি মাস',
    total_revenue: 'মোট আয় (বিক্রয় + সার্ভিস + কমিশন)',
    gross_profit: 'আনুমানিক মোট লাভ',
    net_profit: 'খাঁটি নিট লাভ (খরচ বাদে)',
    top_selling_items: 'সর্বাধিক বিক্রীত পণ্য',
    service_breakdown: 'সার্ভিসিং কাজের বিশ্লেষণ',
    export_csv: 'CSV ডাউনলোড',
    print_report: 'রিপোর্ট প্রিন্ট করুন',

    // Settings & Onboarding
    settings_title: 'দোকানের সেটিংস ও প্রোফাইল',
    business_profile: 'দোকানের পরিচিতি',
    shop_name_bn: 'দোকানের নাম (বাংলা)',
    shop_name_en: 'দোকানের নাম (English)',
    owner_name: 'মালিকের নাম',
    shop_phone: 'দোকানের যোগাযোগ নম্বর',
    district: 'জেলা',
    full_address: 'সম্পূর্ণ ঠিকানা',
    default_lang: 'অ্যাপের প্রাথমিক ভাষা',
    service_categories: 'আপনার দোকানের সেবাসমূহ (মডিউল অন/অফ)',
    save_settings: 'সেটিংস সংরক্ষণ করুন',
    reset_demo: 'ডেমো ডাটা পুনরায় লোড করুন',
    export_backup: 'ডাটা ব্যাকআপ নিন (JSON)',
    pricing_config: 'ফটোকপি ও প্রিন্টের মূল্য তালিকা',
    onboarding_title: 'দোকান সেটআপ ও স্বাগতম',
    onboarding_desc: 'আপনার দোকানের সঠিক তথ্য দিন। কয়েক সেকেন্ডেই শুরু হবে আধুনিক ডিজিটাল দোকান খাতা!',
    get_started: 'দোকান চালু করুন',

    // Common Buttons & Labels
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    delete: 'মুছে ফেলুন',
    edit: 'সম্পাদনা',
    search: 'অনুসন্ধান...',
    filter: 'ফিল্টার',
    date: 'তারিখ',
    action: 'অ্যাকশন',
    status_col: 'অবস্থা',
    close: 'বন্ধ করুন',
    view_details: 'বিস্তারিত দেখুন',
    all: 'সবগুলো',
    success: 'সফল হয়েছে',
    error: 'সমস্যা হয়েছে',
    confirm: 'নিশ্চিত করুন'
  },
  en: {
    // App & Brand
    app_title: 'DokanKhata Pro',
    app_subtitle: 'Smart Shop & Service Management',
    demo_badge: 'Demo Mode',
    language: 'Language',
    bangla: 'বাংলা',
    english: 'English',
    owner: 'Owner',
    staff: 'Staff',
    role: 'Role',
    switch_role: 'Switch Role',

    // Navigation
    nav_dashboard: 'Dashboard',
    nav_pos: 'Sales & POS',
    nav_banking: 'Mobile Banking & Recharge',
    nav_service: 'Mobile Servicing',
    nav_computer: 'Photocopy & Online',
    nav_inventory: 'Stock & Inventory',
    nav_dues: 'Customer Dues (Khata)',
    nav_expenses: 'Shop Expenses',
    nav_reports: 'Reports & Analytics',
    nav_settings: 'Shop Settings',

    // Quick Actions
    quick_new_sale: 'New Sale (POS)',
    quick_new_service: 'New Service Ticket',
    quick_cash_in: 'Cash In / Out',
    quick_record_due: 'Record Due / Payment',
    quick_new_expense: 'New Expense',
    quick_actions: 'Quick Actions',

    // Dashboard
    today_summary: "Today's Business Summary",
    today_sales: "Today's Product Sales",
    today_service_income: "Today's Servicing Income",
    today_banking_commission: 'Banking & Recharge Commission',
    today_expenses: "Today's Total Expenses",
    cash_in_drawer: 'Current Cash in Drawer',
    pending_jobs: 'Active Service Tickets',
    low_stock_items: 'Low Stock Alerts',
    total_customer_due: 'Total Customer Dues (Receivable)',
    recent_activities: 'Recent Activities',
    cash_flow_title: "Today's Cash Flow Reconciliation",

    // POS / Sales
    search_product_placeholder: 'Search product name, barcode...',
    all_categories: 'All Categories',
    cart: 'Billing Cart',
    cart_empty: 'Cart is empty! Click items to add',
    unit_price: 'Price',
    qty: 'Qty',
    subtotal: 'Subtotal',
    discount: 'Discount',
    total: 'Total',
    payment_method: 'Payment Method',
    paid_amount: 'Paid Amount',
    due_amount: 'Due Amount',
    change_amount: 'Change',
    customer_info: 'Customer Info (Required for dues)',
    customer_name: 'Customer Name',
    customer_phone: 'Phone Number',
    customer_address: 'Address',
    select_customer: 'Select Existing Customer',
    complete_sale: 'Complete Sale (Invoice)',
    cash: 'Cash',
    bkash: 'bKash',
    nagad: 'Nagad',
    rocket: 'Rocket',
    due: 'Full Due',
    sale_success: 'Sale completed successfully!',
    print_invoice: 'Print Memo / Invoice',
    thermal_print: 'Thermal Print (80mm)',
    standard_print: 'Standard Memo (A4/A5)',

    // Mobile Banking & Recharge
    mfs_title: 'bKash, Nagad & Rocket Ledger',
    cash_in: 'Cash In',
    cash_out: 'Cash Out',
    agent_number: 'Agent Number',
    customer_number: 'Customer Number',
    amount: 'Amount',
    commission: 'Earned Commission',
    current_float: 'Current e-Balance',
    opening_balance: 'Opening Float Balance',
    provider: 'Provider',
    recharge_title: 'Mobile Recharge (Flexiload)',
    operator: 'Operator',
    prepaid: 'Prepaid',
    postpaid: 'Postpaid',
    submit_tx: 'Confirm Transaction',
    tx_history: "Today's Transactions",
    float_reconciliation: 'Daily Float Reconciliation',

    // Mobile Servicing
    service_title: 'Mobile Repair & Servicing Tickets',
    new_ticket: 'Intake New Device',
    ticket_no: 'Ticket #',
    device_brand: 'Brand',
    device_model: 'Model',
    imei_serial: 'IMEI / Serial (Optional)',
    problem_type: 'Problem Category',
    problem_desc: 'Problem Description',
    estimated_cost: 'Est. Cost (৳)',
    final_cost: 'Final Cost (৳)',
    advance_paid: 'Advance Paid (৳)',
    labor_charge: 'Labor / Service Fee',
    parts_used: 'Parts Used',
    status: 'Status',
    status_received: 'Received',
    status_in_progress: 'In Progress',
    status_waiting_for_parts: 'Waiting for Parts',
    status_ready: 'Ready for Pickup',
    status_delivered: 'Delivered',
    status_cancelled: 'Cancelled',
    print_job_slip: 'Print Repair Slip',
    search_ticket: 'Search name, phone, ticket #...',
    update_status: 'Update Status',
    customer_note_field: 'Customer Notice / Warranty Note',

    // Computer & Online Service
    computer_title: 'Photocopy, Print & Online Services',
    counter_billing: 'Photocopy & Print Quick Billing',
    photocopy_bw: 'Photocopy (B/W)',
    photocopy_color: 'Photocopy (Color)',
    print_bw: 'Print (B/W)',
    print_color: 'Print (Color)',
    document_scan: 'Document Scan',
    passport_photo_4: 'Passport Photo (4 Pcs)',
    passport_photo_8: 'Passport Photo (8 Pcs)',
    photo_edit: 'Photo Background Editing',
    lamination_id: 'Lamination (ID Card)',
    lamination_a4: 'Lamination (A4)',
    quick_add_counter: 'Add to Counter Bill',
    online_service_log: 'Online Application & Gov Services',
    service_type: 'Service Type',
    gov_fee: 'Govt Fee',
    service_charge: 'Shop Fee',
    tracking_no: 'Tracking / Roll #',
    job_application: 'Job Application',
    admission_form: 'Admission Form',
    birth_cert: 'Birth Certificate',
    nid_service: 'NID Card Service',
    passport_form: 'Passport Application',
    bill_payment: 'Electricity / Gas Bill',

    // Inventory
    inventory_title: 'Inventory & Stock Management',
    add_product: 'Add New Product',
    product_name_bn: 'Product Name (Bangla)',
    product_name_en: 'Product Name (English)',
    category: 'Category',
    buy_price: 'Buy Price (৳)',
    sell_price: 'Sell Price (৳)',
    stock_qty: 'Current Stock',
    unit: 'Unit',
    low_stock_limit: 'Low Stock Limit',
    seasonal_product: 'Seasonal Product?',
    season_all: 'All Year',
    season_summer: 'Summer',
    season_winter: 'Winter',
    supplier: 'Supplier / Vendor',
    stock_status: 'Stock Status',
    in_stock: 'In Stock',
    low_stock: 'Low Stock',
    out_of_stock: 'Out of Stock!',
    adjust_stock: 'Stock Adjustment',
    pcs: 'Pcs',
    box: 'Box',
    meter: 'Meter',

    // Dues
    dues_title: 'Customer Dues (বাকি Khata)',
    customer_directory: 'Customer Due List',
    total_due_amount: 'Total Receivable Due',
    total_due_customers: 'Customers with Due',
    add_new_customer: 'Add Customer',
    due_history: 'Due History & Ledger',
    record_due_payment: 'Record Payment (আদায়)',
    collect_due: 'Collect Due',
    collected_amount: 'Collected Amount (৳)',
    send_reminder: 'Send Reminder',
    sms_reminder_template: 'Due Reminder Message',
    copy_sms: 'Copy Message',
    open_whatsapp: 'Send via WhatsApp',
    no_dues: 'No outstanding dues!',

    // Expenses
    expenses_title: 'Daily Shop Expenses',
    add_expense: 'Log New Expense',
    expense_category: 'Expense Category',
    expense_rent: 'Shop Rent',
    expense_electricity: 'Electricity Bill',
    expense_salary: 'Staff Salary',
    expense_tea_snacks: 'Tea & Snacks',
    expense_transport: 'Transport / Delivery',
    expense_tools: 'Servicing Tools',
    expense_internet: 'Internet Bill',
    expense_misc: 'Miscellaneous',
    note: 'Note / Details',
    voucher_no: 'Voucher / Memo #',

    // Reports
    reports_title: 'Business Reports & Analytics',
    period_today: 'Today',
    period_yesterday: 'Yesterday',
    period_7days: 'Last 7 Days',
    period_this_month: 'This Month',
    total_revenue: 'Total Revenue (Sales+Service+Comm.)',
    gross_profit: 'Est. Gross Profit',
    net_profit: 'Net Profit (After Expenses)',
    top_selling_items: 'Top Selling Products',
    service_breakdown: 'Service Job Breakdown',
    export_csv: 'Download CSV',
    print_report: 'Print Report',

    // Settings & Onboarding
    settings_title: 'Shop Settings & Profile',
    business_profile: 'Business Profile',
    shop_name_bn: 'Shop Name (Bangla)',
    shop_name_en: 'Shop Name (English)',
    owner_name: 'Owner Name',
    shop_phone: 'Contact Phone',
    district: 'District',
    full_address: 'Full Address',
    default_lang: 'Default Language',
    service_categories: 'Shop Service Modules (Enable/Disable)',
    save_settings: 'Save Settings',
    reset_demo: 'Reload Demo Data',
    export_backup: 'Export Backup (JSON)',
    pricing_config: 'Photocopy & Service Rates',
    onboarding_title: 'Shop Setup & Onboarding',
    onboarding_desc: 'Set up your shop profile and choose the services you offer. Ready in under 1 minute!',
    get_started: 'Launch Shop Management',

    // Common Buttons & Labels
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search...',
    filter: 'Filter',
    date: 'Date',
    action: 'Action',
    status_col: 'Status',
    close: 'Close',
    view_details: 'View Details',
    all: 'All',
    success: 'Success',
    error: 'Error',
    confirm: 'Confirm'
  }
};
