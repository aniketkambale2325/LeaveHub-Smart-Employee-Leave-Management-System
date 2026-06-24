import { useEffect, useMemo, useState } from 'react';
import { getAdminDashboard } from '../../services/dashboardService';
import { getAllLeaves } from '../../services/leaveRequestService';
import StatCard from '../../components/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import SimpleDonutChart from '../../components/charts/SimpleDonutChart';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getAdminDashboard(), getAllLeaves()])
      .then(([dash, leaves]) => {
        setData(dash.data);
        setRequests(leaves.data || []);
      })
      .catch(err => {
        console.error('Error loading admin dashboard:', err);
        setError('Failed to load dashboard.');
      });
  }, []);

  const monthlyData = useMemo(() => {
    const counts = Array(12).fill(0);
    requests.forEach(r => { counts[new Date(r.startDate).getMonth()] += 1; });
    return MONTHS.map((label, i) => ({ label, value: counts[i] }));
  }, [requests]);

  const statusData = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Approved', value: data.approved },
      { label: 'Pending', value: data.pendingRequests },
      { label: 'Rejected', value: data.rejected },
    ].filter(d => d.value > 0);
  }, [data]);

  const typeData = useMemo(() => {
    const map = {};
    requests.forEach(r => { map[r.leaveTypeName] = (map[r.leaveTypeName] || 0) + 1; });
    return Object.entries(map).slice(0, 5).map(([label, value]) => ({ label, value }));
  }, [requests]);

  const recentRequests = requests.slice(0, 8);
  const approvalRate = data ? Math.round((data.approved / Math.max(1, data.totalRequests)) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Enterprise Overview"
        description="Monitor employee growth, approval performance, and leave activity."
        badge="Live"
      />

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>
      )}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard title="Total Employees" value={data.totalEmployees} icon="👥" color="indigo" trend="up" trendLabel="+ active" />
            <StatCard title="Managers" value={data.totalManagers} icon="🧑‍💼" color="blue" />
            <StatCard title="Total Requests" value={data.totalRequests} icon="📝" color="yellow" />
            <StatCard title="Pending" value={data.pendingRequests} icon="⏳" color="yellow" trend="neutral" />
            <StatCard title="Approved" value={data.approved} icon="✅" color="green" trend="up" trendLabel={`${approvalRate}%`} />
            <StatCard title="Rejected" value={data.rejected} icon="❌" color="red" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900">Monthly Leave Trends</h2>
              <p className="mt-1 text-sm text-slate-500">Request volume by month</p>
              <div className="mt-6 h-44">
                <SimpleBarChart data={monthlyData} color="#6366f1" height={160} />
              </div>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Approval Analytics</h2>
              <p className="mt-1 text-sm text-slate-500">Status breakdown</p>
              <div className="mt-4">
                <SimpleDonutChart data={statusData.length ? statusData : [{ label: 'No data', value: 1 }]} />
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Leave Type Distribution</h2>
              <div className="mt-6 h-40">
                <SimpleBarChart data={typeData.length ? typeData : [{ label: 'N/A', value: 0 }]} color="#3b82f6" />
              </div>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Recent Activities</h2>
              <div className="mt-4 space-y-3">
                {recentRequests.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{r.employeeName}</p>
                      <p className="text-xs text-slate-500">{r.leaveTypeName} · {r.totalDays} days</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
                {!recentRequests.length && (
                  <p className="text-sm text-slate-500">No recent activity.</p>
                )}
              </div>
            </Card>
          </div>

          <Card padding={false}>
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Leave Requests</h2>
            </div>
            <DataTable
              data={recentRequests}
              columns={[
                { key: 'employeeName', label: 'Employee', sortable: true },
                { key: 'leaveTypeName', label: 'Leave Type' },
                { key: 'startDate', label: 'From', render: r => new Date(r.startDate).toLocaleDateString() },
                { key: 'endDate', label: 'To', render: r => new Date(r.endDate).toLocaleDateString() },
                { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
              ]}
              searchKeys={['employeeName', 'leaveTypeName']}
              defaultPageSize={5}
            />
          </Card>
        </>
      )}
    </div>
  );
}
