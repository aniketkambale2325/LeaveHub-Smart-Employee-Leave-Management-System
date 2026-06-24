import { useEffect, useState } from 'react';
import { getPending, approveLeave, rejectLeave } from '../../services/leaveRequestService';
import StatusBadge from '../../components/StatusBadge';
import DataTable from '../../components/DataTable';
import Spinner from '../../components/Spinner';
import ActionModal from '../../components/ActionModal';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionItem, setActionItem] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    getPending()
      .then(r => setRequests(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const leaveTypeOptions = Array.from(new Set((requests || []).map(r => r.leaveTypeName).filter(Boolean)));

  const handle = (id, action) => {
    setActionItem({ id, type: action });
    setComment('');
    setActionOpen(true);
  };

  const doAction = async () => {
    if (!actionItem) return;
    try {
      if (actionItem.type === 'approve') await approveLeave(actionItem.id, { managerComment: comment });
      else await rejectLeave(actionItem.id, { managerComment: comment });
      toast.push('Action completed successfully.', 'success');
      load();
    } catch (err) {
      toast.push(err.response?.data?.message || 'Action failed.', 'error');
    } finally {
      setActionOpen(false);
      setActionItem(null);
      setComment('');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Manager"
        title="Pending Requests"
        description="Review and approve pending requests from your team."
        badge={`${requests.length} pending`}
      />

      <Card padding={false}>
        {loading ? (
          <div className="p-8 text-center text-slate-500"><Spinner /></div>
        ) : (
          <DataTable
            data={requests}
            columns={[
              { key: 'employeeName', label: 'Employee', sortable: true },
              { key: 'leaveTypeName', label: 'Type', sortable: true, filterOptions: leaveTypeOptions },
              { key: 'startDate', label: 'From', render: r => new Date(r.startDate).toLocaleDateString(), sortable: true, sortAccessor: r => new Date(r.startDate).getTime() },
              { key: 'endDate', label: 'To', render: r => new Date(r.endDate).toLocaleDateString(), sortable: true, sortAccessor: r => new Date(r.endDate).getTime() },
              { key: 'totalDays', label: 'Days', sortable: true },
              { key: 'reason', label: 'Reason', render: r => <div className="max-w-xs truncate text-slate-500">{r.reason}</div> },
              { key: 'actions', label: 'Actions', render: r => (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handle(r.id, 'approve')} className="rounded-3xl bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">Approve</button>
                  <button onClick={() => handle(r.id, 'reject')} className="rounded-3xl bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100">Reject</button>
                </div>
              ) }
            ]}
            searchKeys={['employeeName','leaveTypeName']}
          />
        )}
      </Card>

      <ActionModal
        open={actionOpen}
        title={actionItem?.type === 'approve' ? 'Approve Leave' : 'Reject Leave'}
        placeholder={actionItem?.type === 'approve' ? 'Approval comment (optional)' : 'Rejection reason'}
        value={comment}
        onChange={setComment}
        onConfirm={doAction}
        onCancel={() => setActionOpen(false)}
      />
    </div>
  );
}
