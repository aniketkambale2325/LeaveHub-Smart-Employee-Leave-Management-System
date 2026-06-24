import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { getMyBalance } from '../../services/leaveBalanceService';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import StatCard from '../../components/StatCard';

export default function ProfilePage() {
  const { user, role } = useAuth();
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    if (role === 'Employee') {
      getMyBalance().then(r => setBalances(r.data || [])).catch(() => {});
    }
  }, [role]);

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Account" title="Profile" description="Your personal information and leave summary." />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-3xl font-bold text-white shadow-lg shadow-indigo-500/30">
            {initials}
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">{user?.fullName}</h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <span className="mt-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {role}
          </span>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</dt>
              <dd className="mt-1 font-medium text-slate-900">{user?.fullName || '—'}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</dt>
              <dd className="mt-1 font-medium text-slate-900">{user?.email || '—'}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Role</dt>
              <dd className="mt-1 font-medium text-slate-900">{role || '—'}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">User ID</dt>
              <dd className="mt-1 font-medium text-slate-900">{user?.userId || '—'}</dd>
            </div>
          </dl>
        </Card>
      </div>

      {role === 'Employee' && balances.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Leave Summary</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {balances.map(b => (
              <StatCard
                key={b.id}
                title={b.leaveTypeName}
                value={`${b.remainingLeaves}d`}
                icon="📊"
                color="blue"
                trendLabel={`${b.usedLeaves}/${b.totalLeaves} used`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
