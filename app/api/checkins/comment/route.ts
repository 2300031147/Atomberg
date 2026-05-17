import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import type { Quarter } from '@/lib/types';

export async function POST(req: Request) {
  const session = getSession();
  if (!session || (session.role !== 'MANAGER' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { goalId, quarter, managerComment } = await req.json();
  const db = readDb();

  const ciIndex = db.checkIns.findIndex(ci => ci.goalId === goalId && ci.quarter === (quarter as Quarter));
  
  if (ciIndex === -1) {
    return NextResponse.json({ success: true, message: 'No check-in exists yet for this goal and quarter' });
  }
  
  db.checkIns[ciIndex].managerComment = managerComment;
  db.checkIns[ciIndex].updatedAt = new Date().toISOString();

  writeDb(db);
  return NextResponse.json({ success: true });
}
