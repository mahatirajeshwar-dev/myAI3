import { NextRequest, NextResponse } from 'next/server';
import { verifyEmployeeToken } from '@/lib/auth/jwt';

export async function middleware(request: NextRequest) {
  const isChatPath = request.nextUrl.pathname.startsWith('/api/chat');
  const isIngestionPath = request.nextUrl.pathname.startsWith('/api/ingestion');
  const isProtectedPath = isChatPath || isIngestionPath;

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing bearer token' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = await verifyEmployeeToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  if (isIngestionPath && payload.role !== 'hr') {
    return NextResponse.json({ error: 'Only HR uploaders can ingest files' }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/chat/:path*', '/api/ingestion/:path*'],
};
