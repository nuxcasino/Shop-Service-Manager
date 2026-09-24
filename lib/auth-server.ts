import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function getAuthenticatedUser(request?: Request) {
  try {
    const reqHeaders = request ? request.headers : await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });
    if (!session || !session.user) {
      return null;
    }
    return session.user;
  } catch (error) {
    console.error('Error verifying Better Auth session:', error);
    return null;
  }
}

export function unauthorizedResponse(message = 'Unauthorized. Please sign in to access your shop.') {
  return NextResponse.json(
    { error: message, code: 'UNAUTHORIZED' },
    { status: 401 }
  );
}

export function forbiddenResponse(message = 'Forbidden. You do not have access to this resource.') {
  return NextResponse.json(
    { error: message, code: 'FORBIDDEN' },
    { status: 403 }
  );
}
