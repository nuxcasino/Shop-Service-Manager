import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { ensureSchemaInitialized } from '@/db/init';

// Ensure Neon schema is ready on first auth route call
ensureSchemaInitialized().catch((err) => {
  console.error('Failed ensuring schema initialized on auth route:', err);
});

export const { GET, POST } = toNextJsHandler(auth.handler);
