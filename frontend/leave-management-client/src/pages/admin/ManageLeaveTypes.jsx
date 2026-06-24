import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  getLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType
} from '../../services/leaveTypeService';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';

export default function ManageLeaveTypes() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', defaultDays: '' });
  const [editingId, setEditingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const r = await getLeaveTypes();
      setLeaveTypes(r.data || []);
    } catch (err) {
      console.error('Error loading leave types:', err);
      toast.push('Failed to load leave types.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', defaultDays: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.defaultDays) {
      toast.push('Name and default days are required.', 'error');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      defaultDays: parseInt(form.defaultDays, 10)
    };

    try {
      if (editingId) {
        await updateLeaveType(editingId, payload);
        toast.push('Leave type updated.', 'success');
      } else {
        await createLeaveType(payload);
        toast.push('Leave type created.', 'success');
      }
      resetForm();
      load();
    } catch (err) {
      toast.push(err.response?.data?.message || 'Failed to save leave type.', 'error');
    }
  };

  const startEdit = (type) => {
    setEditingId(type.id);
    setForm({
      name: type.name,
      description: type.description || '',
      defaultDays: type.defaultDays.toString()
    });
  };

  const requestDelete = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteLeaveType(selectedId);
      toast.push('Leave type deleted.', 'success');
      load();
    } catch (err) {
      toast.push(err.response?.data?.message || 'Failed to delete leave type.', 'error');
    } finally {
      setConfirmOpen(false);
      setSelectedId(null);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description' },
    { key: 'defaultDays', label: 'Default Days', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (type) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => startEdit(type)}
            className="rounded-3xl bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
          >
            Edit
          </button>
          <button
            onClick={() => requestDelete(type.id)}
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
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage Leave Types</h1>
          </div>
          <span className="inline-flex items-center rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{leaveTypes.length} types</span>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200/10 bg-white/95 p-6 shadow-xl shadow-slate-900/5 max-w-3xl">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{editingId ? 'Edit Leave Type' : 'Add Leave Type'}</h2>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <input
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Default Days</span>
            <input
              type="number"
              min="0"
              value={form.defaultDays}
              onChange={(e) => setForm(prev => ({ ...prev, defaultDays: e.target.value }))}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </label>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600">{editingId ? 'Update' : 'Add'}</button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-3xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">Cancel</button>
            )}
          </div>
        </form>
      </section>

      <DataTable data={leaveTypes} columns={columns} searchKeys={['name', 'description']} />

      <ConfirmModal
        open={confirmOpen}
        title="Delete Leave Type"
        description="Are you sure you want to delete this leave type?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
