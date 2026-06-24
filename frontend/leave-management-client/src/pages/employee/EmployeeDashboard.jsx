import { useEffect, useState } from 'react';
import { getEmployeeDashboard } from '../../services/dashboardService';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getEmployeeDashboard()
      .then(r => setData(r.data))
      .catch(err => {
        console.error('Error loading employee dashboard:', err);
        setError('Failed to load dashboard.');
      });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Employee"
        title="My Leave Insights"
        description="Review your recent requests, current balances, and upcoming time off."
        badge="Personal overview"
      />

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard title="Pending" value={data.pending} icon="⏳" color="yellow" />
            <StatCard title="Approved" value={data.approved} icon="✅" color="green" trend="up" />
            <StatCard title="Rejected" value={data.rejected} icon="❌" color="red" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card padding={false}>
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">Recent Leave Requests</h2>
              </div>
              <DataTable
                data={data.recentRequests}
                columns={[
                  { key: 'type', label: 'Type', render: row => row.name || row.type },
                  { key: 'startDate', label: 'From', render: r => new Date(r.startDate).toLocaleDateString() },
                  { key: 'endDate', label: 'To', render: r => new Date(r.endDate).toLocaleDateString() },
                  { key: 'totalDays', label: 'Days' },
                  { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
                ]}
                defaultPageSize={5}
              />
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Leave Balances</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {data.leaveBalances.map((balance, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-200 hover:shadow-sm">
                    <p className="text-sm font-semibold text-slate-700">{balance.name}</p>
                    <p className="mt-2 text-3xl font-bold text-indigo-600">{balance.remaining}</p>
                    <p className="text-xs text-slate-500">days remaining</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
