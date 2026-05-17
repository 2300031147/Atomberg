import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDb } from '@/lib/db';
import { SESSION_MAX_AGE_SECONDS } from '@/lib/constants';

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || 'dev-secret-fixed-for-testing';
}

function sign(payload: string) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64');
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const db = readDb();
    
    const safeEmail = (email || '').trim().toLowerCase();
    const safePassword = (password || '').trim();
    
    const hashedPassword = crypto.createHash('sha256').update(safePassword).digest('hex');
    
    const user = db.users.find(u => u.email.toLowerCase() === safeEmail && u.password === hashedPassword);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const payload = JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role });
    const payloadBase64 = Buffer.from(payload).toString('base64');
    const signature = sign(payloadBase64);
    const sessionValue = `${payloadBase64}.${signature}`;
    
    const response = NextResponse.json({ success: true, role: user.role });
    response.cookies.set('session', sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error?.message }, { status: 500 });
  }
}
