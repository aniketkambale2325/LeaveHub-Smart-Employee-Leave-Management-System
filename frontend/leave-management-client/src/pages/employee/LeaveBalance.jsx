import { useEffect, useState } from 'react';
import { getMyBalance } from '../../services/leaveBalanceService';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';

export default function LeaveBalance() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBalance()
      .then(r => setBalances(r.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Employee"
        title="Leave Balance"
        description="Track your available leave days across all types."
        badge={`${balances.length} types`}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-40" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {balances.map(b => {
            const pct = b.totalLeaves ? Math.min(100, (b.usedLeaves / b.totalLeaves) * 100) : 0;
            return (
              <Card key={b.id} className="transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-800">{b.leaveTypeName}</h3>
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                    {b.remainingLeaves} left
                  </span>
                </div>
                <p className="mt-4 text-4xl font-bold text-slate-900">{b.remainingLeaves}</p>
                <p className="text-sm text-slate-500">days remaining</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Total</span><span className="font-medium text-slate-700">{b.totalLeaves}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Used</span><span className="font-medium text-rose-600">{b.usedLeaves}</span>
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
