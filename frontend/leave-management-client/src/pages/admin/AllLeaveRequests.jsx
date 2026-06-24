import { useEffect, useState } from 'react';
import { getAllLeaves } from '../../services/leaveRequestService';
import StatusBadge from '../../components/StatusBadge';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';

export default function AllLeaveRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getAllLeaves().then(r => setRequests(r.data || [])).catch(err => console.error('Error loading leave requests:', err));
  }, []);

  const leaveTypes = Array.from(new Set((requests || []).map(r => r.leaveTypeName).filter(Boolean)));
  const statuses = Array.from(new Set((requests || []).map(r => r.status).filter(Boolean)));

  const columns = [
    { key: 'employeeName', label: 'Employee', sortable: true },
    { key: 'leaveTypeName', label: 'Type', sortable: true, filterOptions: leaveTypes },
    { key: 'startDate', label: 'From', render: r => new Date(r.startDate).toLocaleDateString(), sortable: true, sortAccessor: r => new Date(r.startDate).getTime() },
    { key: 'endDate', label: 'To', render: r => new Date(r.endDate).toLocaleDateString(), sortable: true, sortAccessor: r => new Date(r.endDate).getTime() },
    { key: 'totalDays', label: 'Days', sortable: true },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} />, filterOptions: statuses },
    { key: 'appliedDate', label: 'Applied', render: r => new Date(r.appliedDate).toLocaleDateString(), sortable: true, sortAccessor: r => new Date(r.appliedDate).getTime() },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="All Leave Requests"
        description="Browse every request with filters for type and status."
        badge={`${requests.length} requests`}
      />

      <Card padding={false}>
        <DataTable data={requests} columns={columns} searchKeys={['employeeName','leaveTypeName']} />
      </Card>
    </div>
  );
}
