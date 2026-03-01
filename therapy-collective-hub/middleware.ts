import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  // Allow public access to login page and static assets
  if (isLoginPage || request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }

  // Allow seed route for easy setup
  if (request.nextUrl.pathname === '/api/seed') {
    return NextResponse.next();
  }

  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
