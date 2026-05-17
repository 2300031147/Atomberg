import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDb } from '@/lib/db';
import { setSession } from '@/lib/auth';

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
    
    setSession(user);
    return NextResponse.json({ success: true, role: user.role });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error?.message }, { status: 500 });
  }
}
