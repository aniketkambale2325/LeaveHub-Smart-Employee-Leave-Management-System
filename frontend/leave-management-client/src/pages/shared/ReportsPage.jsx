import { useEffect, useMemo, useState } from 'react';
import { getAllLeaves, getTeamLeaves } from '../../services/leaveRequestService';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import SimpleDonutChart from '../../components/charts/SimpleDonutChart';
import SimpleLineChart from '../../components/charts/SimpleLineChart';
import StatCard from '../../components/StatCard';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildMonthlyData(requests) {
  const counts = Array(12).fill(0);
  requests.forEach(r => {
    const month = new Date(r.startDate).getMonth();
    counts[month] += r.totalDays || 1;
  });
  return MONTHS.map((label, i) => ({ label, value: counts[i] }));
}

function buildStatusData(requests) {
  const map = {};
  requests.forEach(r => { map[r.status] = (map[r.status] || 0) + 1; });
  return Object.entries(map).map(([label, value]) => ({ label, value }));
}

function buildTypeData(requests) {
  const map = {};
  requests.forEach(r => {
    const key = r.leaveTypeName || 'Other';
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map).map(([label, value]) => ({ label, value }));
}

export default function ReportsPage() {
  const { role } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = role === 'Admin' ? getAllLeaves : getTeamLeaves;
    fetcher()
      .then(r => setRequests(r.data || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, [role]);

  const monthly = useMemo(() => buildMonthlyData(requests), [requests]);
  const byStatus = useMemo(() => buildStatusData(requests), [requests]);
  const byType = useMemo(() => buildTypeData(requests), [requests]);

  const approved = requests.filter(r => r.status === 'Approved').length;
  const rejected = requests.filter(r => r.status === 'Rejected').length;
  const pending = requests.filter(r => r.status === 'Pending').length;
  const approvalRate = requests.length ? Math.round((approved / requests.length) * 100) : 0;

  const recentMonths = monthly.slice(new Date().getMonth() - 5, new Date().getMonth() + 1).filter(Boolean);
  const lineData = recentMonths.length >= 2 ? recentMonths : monthly.slice(0, 6);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-32" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="skeleton h-28" />
          <div className="skeleton h-28" />
          <div className="skeleton h-28" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Reports & Analytics"
        description="Visualize leave trends, approval rates, and department usage."
        badge={`${requests.length} total records`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Requests" value={requests.length} icon="📋" color="indigo" />
        <StatCard title="Approved" value={approved} icon="✅" color="green" trend="up" trendLabel={`${approvalRate}% rate`} />
        <StatCard title="Pending" value={pending} icon="⏳" color="yellow" />
        <StatCard title="Rejected" value={rejected} icon="❌" color="red" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-slate-900">Monthly Leave Usage</h3>
          <p className="mt-1 text-sm text-slate-500">Total leave days per month</p>
          <div className="mt-6">
            <SimpleBarChart data={monthly} color="#6366f1" />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900">Leave Approval Analytics</h3>
          <p className="mt-1 text-sm text-slate-500">Distribution by status</p>
          <div className="mt-6">
            <SimpleDonutChart data={byStatus.length ? byStatus : [{ label: 'No data', value: 1 }]} />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900">Department / Type Trends</h3>
          <p className="mt-1 text-sm text-slate-500">Requests by leave type</p>
          <div className="mt-6">
            <SimpleBarChart data={byType.slice(0, 6)} color="#3b82f6" />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900">Usage Trend</h3>
          <p className="mt-1 text-sm text-slate-500">Recent monthly pattern</p>
          <div className="mt-6">
            <SimpleLineChart data={lineData} color="#6366f1" />
          </div>
        </Card>
      </div>
    </div>
  );
}
