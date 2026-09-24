import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';
import { updateBusinessInDb } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const businessData = await request.json();
    if (!businessData) {
      return NextResponse.json({ error: 'Invalid business settings' }, { status: 400 });
    }

    await updateBusinessInDb(user.id, businessData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating business settings:', error);
    return NextResponse.json({ error: 'Failed to update business' }, { status: 500 });
  }
}
