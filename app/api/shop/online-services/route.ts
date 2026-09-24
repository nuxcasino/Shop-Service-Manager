import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';
import { createOnlineServiceInDb } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const item = await request.json();
    if (!item || !item.id || !item.serviceType) {
      return NextResponse.json({ error: 'Invalid online service data' }, { status: 400 });
    }

    await createOnlineServiceInDb(user.id, item);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording online service:', error);
    return NextResponse.json({ error: 'Failed to record online service' }, { status: 500 });
  }
}
