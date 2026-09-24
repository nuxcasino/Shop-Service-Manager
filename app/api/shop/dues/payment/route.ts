import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';
import { recordDuePaymentInDb } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { entry, remainingDue } = await request.json();
    if (!entry || typeof remainingDue !== 'number') {
      return NextResponse.json({ error: 'Invalid due payment data' }, { status: 400 });
    }

    await recordDuePaymentInDb(user.id, entry, remainingDue);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording due payment:', error);
    return NextResponse.json({ error: 'Failed to record due payment' }, { status: 500 });
  }
}
