import { neonSql } from './index';

let isInitialized = false;

export async function ensureSchemaInitialized(): Promise<boolean> {
  if (isInitialized) return true;
  if (!neonSql) return false;

  try {
    // 1. Better Auth tables
    await neonSql`
      CREATE TABLE IF NOT EXISTS "user" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified BOOLEAN NOT NULL DEFAULT FALSE,
        image TEXT,
        role TEXT NOT NULL DEFAULT 'owner',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "session" (
        id TEXT PRIMARY KEY,
        expires_at TIMESTAMP NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        ip_address TEXT,
        user_agent TEXT,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "account" (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        access_token TEXT,
        refresh_token TEXT,
        id_token TEXT,
        access_token_expires_at TIMESTAMP,
        refresh_token_expires_at TIMESTAMP,
        scope TEXT,
        password TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "verification" (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // 2. Application Domain Tables (Strict User Isolation)
    await neonSql`
      CREATE TABLE IF NOT EXISTS "businesses" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        name_bn TEXT NOT NULL,
        name_en TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        district TEXT NOT NULL,
        tagline_bn TEXT,
        tagline_en TEXT,
        default_locale TEXT NOT NULL DEFAULT 'bn',
        currency TEXT NOT NULL DEFAULT 'BDT',
        categories JSONB NOT NULL,
        rates JSONB NOT NULL,
        is_configured BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "products" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        business_id TEXT,
        name_bn TEXT NOT NULL,
        name_en TEXT NOT NULL,
        category TEXT NOT NULL,
        buy_price INTEGER NOT NULL,
        sell_price INTEGER NOT NULL,
        stock_qty INTEGER NOT NULL,
        unit TEXT DEFAULT 'pcs',
        low_stock_threshold INTEGER NOT NULL,
        photo_url TEXT,
        seasonal_tag TEXT,
        is_seasonal BOOLEAN NOT NULL DEFAULT FALSE,
        season TEXT,
        supplier TEXT,
        sku TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "customers" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        business_id TEXT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT,
        due_balance INTEGER NOT NULL DEFAULT 0,
        total_spent INTEGER NOT NULL DEFAULT 0,
        last_transaction_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "sales" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        business_id TEXT,
        invoice_no TEXT NOT NULL,
        customer_id TEXT,
        customer_name TEXT NOT NULL,
        customer_phone TEXT,
        items JSONB NOT NULL,
        subtotal INTEGER NOT NULL,
        discount INTEGER NOT NULL DEFAULT 0,
        total_amount INTEGER NOT NULL,
        paid_amount INTEGER NOT NULL,
        due_amount INTEGER NOT NULL DEFAULT 0,
        payment_method TEXT NOT NULL,
        notes TEXT,
        created_by TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "service_jobs" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        business_id TEXT,
        ticket_no TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        device_brand TEXT NOT NULL,
        device_model TEXT NOT NULL,
        imei TEXT,
        service_type TEXT NOT NULL,
        problem_description TEXT NOT NULL,
        status TEXT NOT NULL,
        estimated_cost INTEGER NOT NULL,
        final_cost INTEGER,
        advance_paid INTEGER NOT NULL DEFAULT 0,
        due_amount INTEGER NOT NULL DEFAULT 0,
        parts_used JSONB,
        labor_cost INTEGER NOT NULL DEFAULT 0,
        warranty_days INTEGER NOT NULL DEFAULT 0,
        estimated_delivery TIMESTAMP,
        notes TEXT,
        notification_note TEXT,
        received_date TIMESTAMP NOT NULL DEFAULT NOW(),
        completed_date TIMESTAMP,
        delivery_date TIMESTAMP,
        created_by TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "provider_balances" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        provider TEXT NOT NULL,
        opening_balance INTEGER NOT NULL DEFAULT 0,
        current_balance INTEGER NOT NULL DEFAULT 0,
        target_balance INTEGER,
        last_updated TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "mobile_banking_tx" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        business_id TEXT,
        provider TEXT NOT NULL,
        type TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        amount INTEGER NOT NULL,
        commission REAL NOT NULL DEFAULT 0,
        agent_number TEXT,
        tx_id TEXT,
        note TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "recharges" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        business_id TEXT,
        operator TEXT NOT NULL,
        phone TEXT NOT NULL,
        amount INTEGER NOT NULL,
        commission REAL NOT NULL DEFAULT 0,
        is_postpaid BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "online_services" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        business_id TEXT,
        service_type TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        gov_fee INTEGER NOT NULL DEFAULT 0,
        service_charge INTEGER NOT NULL,
        total_fee INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'completed',
        tracking_number TEXT,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "expenses" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        business_id TEXT,
        category TEXT NOT NULL,
        amount INTEGER NOT NULL,
        payment_method TEXT,
        note TEXT,
        voucher_no TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await neonSql`
      CREATE TABLE IF NOT EXISTS "due_ledger" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        business_id TEXT,
        customer_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        related_sale_id TEXT,
        related_service_id TEXT,
        type TEXT NOT NULL,
        amount INTEGER NOT NULL,
        note TEXT NOT NULL,
        balance_after INTEGER NOT NULL DEFAULT 0,
        payment_method TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    isInitialized = true;
    return true;
  } catch (err) {
    console.error('Failed to initialize Neon PostgreSQL schema:', err);
    return false;
  }
}
