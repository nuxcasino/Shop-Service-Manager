import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';
import { createServiceJobInDb, updateServiceJobInDb } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const jobData = await request.json();
    if (!jobData || !jobData.id || !jobData.ticketNo) {
      return NextResponse.json({ error: 'Invalid service ticket data' }, { status: 400 });
    }

    await createServiceJobInDb(user.id, jobData);
    return NextResponse.json({ success: true, job: jobData });
  } catch (error) {
    console.error('Error creating service job:', error);
    return NextResponse.json({ error: 'Failed to record service ticket' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { id, updates } = await request.json();
    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing job id or updates' }, { status: 400 });
    }

    await updateServiceJobInDb(user.id, id, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating service job:', error);
    return NextResponse.json({ error: 'Failed to update service ticket' }, { status: 500 });
  }
}
