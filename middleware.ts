import { NextRequest, NextResponse } from 'next/server';
import { verifyEmployeeToken } from '@/lib/auth/jwt';

export async function middleware(request: NextRequest) {


  const isProtectedPath = request.nextUrl.pathname.startsWith('/api/ingestion');

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Bypass prefetch requests to avoid build/render loops
  if (request.headers.get('x-middleware-prefetch')) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/ingestion/:path*'],
};
