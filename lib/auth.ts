import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { memoryAdapter, type MemoryDB } from 'better-auth/adapters/memory';
import { db, schema, isNeonConfigured } from '@/db';

// In-memory fallback if Neon DATABASE_URL is not yet set in environment
const fallbackMemoryDb: MemoryDB = {
  user: [],
  session: [],
  account: [],
  verification: [],
};

export const auth = betterAuth({
  database:
    isNeonConfigured && db
      ? drizzleAdapter(db, {
          provider: 'pg',
          schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
          },
        })
      : memoryAdapter(fallbackMemoryDb),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'owner',
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret:
    process.env.BETTER_AUTH_SECRET ||
    'dokankhata-pro-production-secret-auth-key-32-chars-long',
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.APP_URL ||
    'http://localhost:3000',
});

export type Session = typeof auth.$Infer.Session;
