import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';
import { recordBankingTxInDb } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { tx, newBalance } = await request.json();
    if (!tx || typeof newBalance !== 'number') {
      return NextResponse.json({ error: 'Invalid transaction payload' }, { status: 400 });
    }

    await recordBankingTxInDb(user.id, tx, newBalance);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording banking tx:', error);
    return NextResponse.json({ error: 'Failed to record transaction' }, { status: 500 });
  }
}
