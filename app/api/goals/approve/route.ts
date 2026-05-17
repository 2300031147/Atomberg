import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notifyEmployeeOnApproval, notifyEmployeeOnReturn } from '@/lib/notifications';
import type { Goal } from '@/lib/types';

export async function POST(req: Request) {
  const session = getSession();
  if (!session || (session.role !== 'MANAGER' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { employeeId, action, managerComment } = await req.json();
  const db = readDb();

  const goals = db.goals.filter(g => g.employeeId === employeeId && g.status === 'SUBMITTED');

  if (goals.length === 0) {
    return NextResponse.json({ error: 'No submitted goals found' }, { status: 400 });
  }

  if (action === 'APPROVE') {
    const totalWeight = goals.reduce((sum, g) => sum + g.weightage, 0);
    if (Math.round(totalWeight) !== 100) {
      return NextResponse.json({ error: `Total weightage is ${totalWeight}%. Must be exactly 100% to approve.` }, { status: 400 });
    }
  }

  for (const goal of goals) {
    const idx = db.goals.findIndex(g => g.id === goal.id);
    if (idx === -1) continue;
    db.goals[idx] = {
      ...db.goals[idx],
      status: action === 'APPROVE' ? 'APPROVED' : 'RETURNED',
      isLocked: action === 'APPROVE' ? true : db.goals[idx].isLocked,
      managerComment: managerComment || db.goals[idx].managerComment,
      updatedAt: new Date().toISOString()
    } as Goal;

    db.auditLogs.push({
      id: `log-${Date.now()}-${goal.id}`,
      goalId: goal.id,
      userId: session.id,
      userName: session.name,
      goalTitle: goal.title,
      changeType: action,
      oldValue: 'SUBMITTED',
      newValue: db.goals[idx].status,
      changedAt: new Date().toISOString()
    });
  }

  writeDb(db);

  if (action === 'APPROVE') {
    notifyEmployeeOnApproval(employeeId);
  } else {
    notifyEmployeeOnReturn(employeeId, managerComment || 'Please revise and resubmit');
  }

  return NextResponse.json({ success: true });
}
