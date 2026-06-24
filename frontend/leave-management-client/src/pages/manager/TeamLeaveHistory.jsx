import { useEffect, useState } from 'react';
import { getTeamLeaves } from '../../services/leaveRequestService';
import StatusBadge from '../../components/StatusBadge';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';

export default function TeamLeaveHistory() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getTeamLeaves().then(r => setRequests(r.data || [])).catch(err => console.error(err));
  }, []);

  const columns = [
    { key: 'employeeName', label: 'Employee', sortable: true },
    { key: 'leaveTypeName', label: 'Leave Type', sortable: true },
    { key: 'startDate', label: 'From', render: r => new Date(r.startDate).toLocaleDateString() },
    { key: 'endDate', label: 'To', render: r => new Date(r.endDate).toLocaleDateString() },
    { key: 'totalDays', label: 'Days' },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Manager"
        title="Team Leave History"
        description="Complete history of leave requests from your team."
        badge={`${requests.length} records`}
      />

      <Card padding={false}>
        <DataTable data={requests} columns={columns} searchKeys={['employeeName', 'leaveTypeName']} />
      </Card>
    </div>
  );
}
