import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';
import { createExpenseInDb } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const expense = await request.json();
    if (!expense || !expense.id || !expense.title) {
      return NextResponse.json({ error: 'Invalid expense data' }, { status: 400 });
    }

    await createExpenseInDb(user.id, expense);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording expense:', error);
    return NextResponse.json({ error: 'Failed to record expense' }, { status: 500 });
  }
}
