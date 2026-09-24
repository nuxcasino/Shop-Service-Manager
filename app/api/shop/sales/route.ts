import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';
import { createSaleInDb } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const saleData = await request.json();
    if (!saleData || !saleData.id || !saleData.invoiceNo || !saleData.items) {
      return NextResponse.json({ error: 'Invalid sale data' }, { status: 400 });
    }

    await createSaleInDb(user.id, saleData);
    return NextResponse.json({ success: true, sale: saleData });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json({ error: 'Failed to record sale' }, { status: 500 });
  }
}
