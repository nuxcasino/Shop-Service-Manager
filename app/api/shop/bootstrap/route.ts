import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';
import { getUserBootstrapData } from '@/lib/db/repository';
import { ensureSchemaInitialized } from '@/db/init';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    // Ensure schema exists in Neon if configured
    await ensureSchemaInitialized();

    const data = await getUserBootstrapData(user.id);
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: (user as any).role || 'owner',
      },
      ...data,
    });
  } catch (error) {
    console.error('Error in /api/shop/bootstrap:', error);
    return NextResponse.json(
      { error: 'Internal Server Error fetching shop data' },
      { status: 500 }
    );
  }
}
