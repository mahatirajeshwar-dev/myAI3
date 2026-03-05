import { NextRequest, NextResponse } from 'next/server';
import { verifyEmployeeToken } from '@/lib/auth/jwt';

export async function middleware(request: NextRequest) {
<<<<<<< HEAD

=======
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
  const isProtectedPath = request.nextUrl.pathname.startsWith('/api/chat') || request.nextUrl.pathname.startsWith('/api/ingestion');

  if (!isProtectedPath) {
    return NextResponse.next();
  }

<<<<<<< HEAD
  // Bypass prefetch requests to avoid build/render loops
  if (request.headers.get('x-middleware-prefetch')) {
    return NextResponse.next();
  }

=======
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
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
  matcher: ['/api/chat/:path*', '/api/ingestion/:path*'],
};
