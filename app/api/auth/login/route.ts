import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDb } from '@/lib/db';
import { setSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const db = readDb();
    
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    const user = db.users.find(u => u.email === email && u.password === hashedPassword);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    setSession(user);
    return NextResponse.json({ success: true, role: user.role });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
