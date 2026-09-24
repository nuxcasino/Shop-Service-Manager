import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';
import { recordRechargeInDb } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { recharge, newBalance } = await request.json();
    if (!recharge || typeof newBalance !== 'number') {
      return NextResponse.json({ error: 'Invalid recharge payload' }, { status: 400 });
    }

    await recordRechargeInDb(user.id, recharge, newBalance);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording recharge:', error);
    return NextResponse.json({ error: 'Failed to record recharge' }, { status: 500 });
  }
}
