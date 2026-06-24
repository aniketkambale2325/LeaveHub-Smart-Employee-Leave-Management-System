import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../../services/departmentService';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ departmentName: '' });
  const [editingId, setEditingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const r = await getDepartments();
      setDepartments(r.data || []);
    } catch (err) {
      console.error('Error loading departments:', err);
      toast.push('Failed to load departments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ departmentName: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.departmentName.trim()) {
      toast.push('Department name is required.', 'error');
      return;
    }

    try {
      if (editingId) {
        await updateDepartment(editingId, { departmentName: form.departmentName.trim() });
        toast.push('Department updated.', 'success');
      } else {
        await createDepartment({ departmentName: form.departmentName.trim() });
        toast.push('Department created.', 'success');
      }
      resetForm();
      load();
    } catch (err) {
      toast.push(err.response?.data?.message || 'Failed to save department.', 'error');
    }
  };

  const startEdit = (dept) => {
    setEditingId(dept.id);
    setForm({ departmentName: dept.departmentName });
  };

  const requestDelete = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteDepartment(selectedId);
      toast.push('Department deleted.', 'success');
      load();
    } catch (err) {
      toast.push(err.response?.data?.message || 'Failed to delete department.', 'error');
    } finally {
      setConfirmOpen(false);
      setSelectedId(null);
    }
  };

  const columns = [
    { key: 'departmentName', label: 'Name', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (dept) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => startEdit(dept)}
            className="rounded-3xl bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
          >
            Edit
          </button>
          <button
            onClick={() => requestDelete(dept.id)}
            className="rounded-3xl bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200/10 bg-white/95 p-6 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Admin tools</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage Departments</h1>
          </div>
          <span className="inline-flex items-center rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{departments.length} departments</span>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200/10 bg-white/95 p-6 shadow-xl shadow-slate-900/5">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{editingId ? 'Edit Department' : 'Add Department'}</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
          <label className="block w-full">
            <span className="text-sm font-medium text-slate-700">Department Name</span>
            <input
              value={form.departmentName}
              onChange={(e) => setForm({ departmentName: e.target.value })}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600">{editingId ? 'Update' : 'Add'}</button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-3xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">Cancel</button>
            )}
          </div>
        </form>
      </section>

      <DataTable data={departments} columns={columns} searchKeys={['departmentName']} />

      <ConfirmModal
        open={confirmOpen}
        title="Delete Department"
        description="Are you sure you want to delete this department?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
