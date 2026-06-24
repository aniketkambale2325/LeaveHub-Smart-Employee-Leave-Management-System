import { useEffect, useMemo, useState } from 'react';
import { getManagerDashboard } from '../../services/dashboardService';
import { getPending, getTeamLeaves } from '../../services/leaveRequestService';
import StatCard from '../../components/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import SimpleDonutChart from '../../components/charts/SimpleDonutChart';

export default function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [pending, setPending] = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getManagerDashboard(), getPending(), getTeamLeaves()])
      .then(([dash, pend, team]) => {
        setData(dash.data);
        setPending(pend.data || []);
        setTeamLeaves(team.data || []);
      })
      .catch(err => {
        console.error('Error loading manager dashboard:', err);
        setError('Failed to load dashboard.');
      });
  }, []);

  const statusData = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Approved', value: data.approved },
      { label: 'Pending', value: data.pendingApprovals },
      { label: 'Rejected', value: data.rejected },
    ].filter(d => d.value > 0);
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Manager"
        title="Team Performance"
        description="Track pending approvals, completed requests, and team capacity."
        badge="Live insights"
      />

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Team Members" value={data.teamCount} icon="👥" color="indigo" />
            <StatCard title="Pending Approvals" value={data.pendingApprovals} icon="⏳" color="yellow" trend="neutral" />
            <StatCard title="Approved" value={data.approved} icon="✅" color="green" trend="up" />
            <StatCard title="Rejected" value={data.rejected} icon="❌" color="red" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Approval Analytics</h2>
              <div className="mt-4">
                <SimpleDonutChart data={statusData.length ? statusData : [{ label: 'No data', value: 1 }]} />
              </div>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Recent Team Activity</h2>
              <div className="mt-4 space-y-3">
                {teamLeaves.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{r.employeeName}</p>
                      <p className="text-xs text-slate-500">{r.leaveTypeName}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card padding={false}>
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Pending Requests</h2>
            </div>
            <DataTable
              data={pending}
              columns={[
                { key: 'employeeName', label: 'Employee' },
                { key: 'leaveTypeName', label: 'Type' },
                { key: 'startDate', label: 'From', render: r => new Date(r.startDate).toLocaleDateString() },
                { key: 'endDate', label: 'To', render: r => new Date(r.endDate).toLocaleDateString() },
                { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
              ]}
              searchKeys={['employeeName']}
              defaultPageSize={5}
            />
          </Card>
        </>
      )}
    </div>
  );
}
