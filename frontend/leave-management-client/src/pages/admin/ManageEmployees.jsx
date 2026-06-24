import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../../services/employeeService';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import { useMemo } from 'react';

function Avatar({ name }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-xs font-bold text-white">
      {initials}
    </div>
  );
}

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const r = await getEmployees();
      setEmployees(r.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const requestDelete = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    await deleteEmployee(selectedId);
    setConfirmOpen(false);
    setSelectedId(null);
    load();
  };

  const columns = [
    {
      key: 'fullName',
      label: 'Employee',
      sortable: true,
      render: e => (
        <div className="flex items-center gap-3">
          <Avatar name={e.fullName} />
          <div>
            <p className="font-medium text-slate-800">{e.fullName}</p>
            <p className="text-xs text-slate-500">{e.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      filterOptions: ['Admin', 'Manager', 'Employee'],
      render: e => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          e.role === 'Admin' ? 'bg-purple-100 text-purple-700'
          : e.role === 'Manager' ? 'bg-blue-100 text-blue-700'
          : 'bg-slate-100 text-slate-700'
        }`}>
          {e.role}
        </span>
      ),
    },
    { key: 'departmentName', label: 'Department', render: e => e.departmentName || '—' },
    {
      key: 'isActive',
      label: 'Status',
      filterOptions: [true, false],
      render: e => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${e.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {e.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: e => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/employees/edit/${e.id}`)}>Edit</Button>
          <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => requestDelete(e.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  const departmentOptions = useMemo(
    () => Array.from(new Set(employees.map(e => e.departmentName).filter(Boolean))),
    [employees]
  );

  if (departmentOptions.length) {
    const idx = columns.findIndex(c => c.key === 'departmentName');
    if (idx >= 0) columns[idx].filterOptions = departmentOptions;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Employee Management"
        description="Search, filter, and manage your workforce."
        badge={`${employees.length} employees`}
        actions={<Button onClick={() => navigate('/admin/employees/add')}>+ Add Employee</Button>}
      />

      <DataTable
        data={employees}
        columns={columns}
        searchKeys={['fullName', 'email']}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Deactivate Employee"
        description="Are you sure you want to deactivate this employee?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
