import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';
import { upsertProductInDb, deleteProductInDb } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const product = await request.json();
    if (!product || !product.id || !product.nameBn) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }

    await upsertProductInDb(user.id, product);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error saving product:', error);
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    }

    await deleteProductInDb(user.id, id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
