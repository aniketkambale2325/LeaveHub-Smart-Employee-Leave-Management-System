import { useState, useEffect } from 'react';
import { applyLeave } from '../../services/leaveRequestService';
import { getLeaveTypes } from '../../services/leaveTypeService';
import { getMyBalance } from '../../services/leaveBalanceService';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Select, TextArea } from '../../components/ui/Input';

export default function ApplyLeave() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [balances, setBalances] = useState([]);
  const [form, setForm] = useState({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([getLeaveTypes(), getMyBalance()])
      .then(([types, bal]) => {
        setLeaveTypes(types.data || []);
        setBalances(bal.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalDays = form.startDate && form.endDate
    ? Math.max(0, Math.floor((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1)
    : 0;

  const selectedBalance = balances.find(b => b.leaveTypeId === parseInt(form.leaveTypeId));

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);
    try {
      await applyLeave({
        leaveTypeId: parseInt(form.leaveTypeId),
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });
      setMessage({ type: 'success', text: 'Leave applied successfully!' });
      setForm({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
      getMyBalance().then(r => setBalances(r.data || []));
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to apply.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Employee"
        title="Apply for Leave"
        description="Submit a new leave request with dates and reason."
      />

      {message.text && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${
          message.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-rose-200 bg-rose-50 text-rose-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Leave Type"
              name="leaveTypeId"
              value={form.leaveTypeId}
              onChange={handleChange}
              required
            >
              <option value="">Select leave type</option>
              {leaveTypes.map(lt => (
                <option key={lt.id} value={lt.id}>{lt.name}</option>
              ))}
            </Select>

            {selectedBalance && (
              <p className="-mt-2 text-xs font-medium text-indigo-600">
                Available balance: {selectedBalance.remainingLeaves} days
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Start Date</span>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">End Date</span>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate || new Date().toISOString().split('T')[0]}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
            </div>

            {totalDays > 0 && (
              <div className="rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
                Total days requested: {totalDays}
              </div>
            )}

            <TextArea
              label="Reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              required
              placeholder="Provide a reason for your leave..."
            />

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              Attach Documents — feature placeholder (not required)
            </div>

            <Button type="submit" disabled={submitting || loading} className="w-full sm:w-auto">
              {submitting ? 'Submitting...' : 'Apply for Leave'}
            </Button>
          </form>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900">Your Balances</h3>
          <div className="mt-4 space-y-3">
            {balances.map(b => (
              <div key={b.id} className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-700">{b.leaveTypeName}</p>
                <p className="mt-1 text-2xl font-bold text-indigo-600">{b.remainingLeaves}</p>
                <p className="text-xs text-slate-500">days remaining</p>
              </div>
            ))}
            {!balances.length && !loading && (
              <p className="text-sm text-slate-500">No balance data available.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
