import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = await request.json();
  const sharedPassword = process.env.SHARED_PASSWORD || 'default-secret-do-not-use-in-prod';
  const sharedPassword2 = process.env.SHARED_PASSWORD_2;

  // Accept either password
  if (password === sharedPassword || (sharedPassword2 && password === sharedPassword2)) {
    const token = signToken({ authenticated: true });
    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
}
