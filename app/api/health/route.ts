import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    appName: 'DokanKhata Pro',
    version: '1.0.0',
    currency: 'BDT (৳)',
    timestamp: new Date().toISOString()
  });
}
