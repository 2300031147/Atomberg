'use client';

import { useToast } from '@/components/Toast';

export default function PushKpiButton() {
  const { showToast } = useToast();

  const handlePush = () => {
    const thrustArea = prompt('Enter Thrust Area:');
    const title = prompt('Enter Goal Title:');
    const target = prompt('Enter Target Value:');
    const weightage = prompt('Enter Weightage (10-100):');
    if (!thrustArea || !title || !target || !weightage) return;

    fetch('/api/admin/shared-goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thrustArea, title, target, weightage, description: 'Departmental Shared Goal' })
    }).then(res => {
      if (res.ok) showToast('KPI pushed to all direct reports!', 'success');
      else showToast('Failed to push KPI', 'error');
    }).catch(() => showToast('Network error pushing KPI', 'error'));
  };

  return (
    <button
      onClick={handlePush}
      className="btn-secondary text-sm flex items-center gap-2 border-brand-200 text-brand-600 hover:bg-brand-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      Push Departmental KPI
    </button>
  );
}