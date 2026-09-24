import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export const isNeonConfigured = Boolean(
  process.env.DATABASE_URL &&
    (process.env.DATABASE_URL.startsWith('postgres://') ||
      process.env.DATABASE_URL.startsWith('postgresql://')) &&
    !process.env.DATABASE_URL.includes('MY_') &&
    !process.env.DATABASE_URL.includes('user:password@ep-sample')
);

// Neon serverless query client
export const neonSql = isNeonConfigured && process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : null;

// Drizzle ORM client with schema
export const db = neonSql ? drizzle(neonSql, { schema }) : null;

export { schema };
