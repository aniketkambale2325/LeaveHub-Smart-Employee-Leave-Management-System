import { useEffect, useState } from 'react';
import { getMyLeaves, cancelLeave } from '../../services/leaveRequestService';
import StatusBadge from '../../components/StatusBadge';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import Spinner from '../../components/Spinner';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function MyLeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const load = () => {
    setLoading(true);
    getMyLeaves()
      .then(r => setLeaves(r.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const requestCancel = (id) => { setSelectedId(id); setConfirmOpen(true); };
  const handleCancel = async () => {
    if (!selectedId) return;
    await cancelLeave(selectedId);
    setConfirmOpen(false);
    setSelectedId(null);
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Employee"
        title="My Leave Requests"
        description="View and manage your submitted leave applications."
        badge={`${leaves.length} requests`}
      />

      <Card padding={false}>
        {loading ? (
          <div className="p-12 text-center text-slate-400"><Spinner /></div>
        ) : (
          <DataTable
            data={leaves}
            columns={[
              { key: 'leaveTypeName', label: 'Type', sortable: true },
              { key: 'startDate', label: 'From', render: r => new Date(r.startDate).toLocaleDateString() },
              { key: 'endDate', label: 'To', render: r => new Date(r.endDate).toLocaleDateString() },
              { key: 'totalDays', label: 'Days' },
              { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
              { key: 'reason', label: 'Reason', render: r => <div className="max-w-xs truncate text-slate-500">{r.reason}</div> },
              {
                key: 'actions',
                label: 'Action',
                render: r => r.status === 'Pending' ? (
                  <Button variant="ghost" size="sm" className="text-rose-600" onClick={() => requestCancel(r.id)}>Cancel</Button>
                ) : '—',
              },
            ]}
            searchKeys={['leaveTypeName']}
          />
        )}
      </Card>

      <ConfirmModal
        open={confirmOpen}
        title="Cancel Leave"
        description="Are you sure you want to cancel this leave request?"
        confirmLabel="Cancel Request"
        onConfirm={handleCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
