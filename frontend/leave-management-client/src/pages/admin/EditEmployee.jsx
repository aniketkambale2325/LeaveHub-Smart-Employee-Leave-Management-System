import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { getEmployee, updateEmployee, getEmployees } from '../../services/employeeService';
import { getDepartments } from '../../services/departmentService';

export default function EditEmployee() {
  const { id } = useParams();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    role: 'Employee',
    departmentId: '',
    managerId: '',
    isActive: true
  });
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    getDepartments().then(r => setDepartments(r.data || [])).catch(err => console.error('Error loading departments:', err));
    getEmployees()
      .then(r => setManagers((r.data || []).filter(e => e.role === 'Manager' && e.isActive)))
      .catch(err => console.error('Error loading managers:', err));

    if (id) {
      getEmployee(id)
        .then(r => {
          const emp = r.data;
          setForm({
            fullName: emp.fullName || '',
            email: emp.email || '',
            role: emp.role || 'Employee',
            departmentId: emp.departmentId?.toString() || '',
            managerId: emp.managerId?.toString() || '',
            isActive: emp.isActive ?? true
          });
        })
        .catch(err => {
          console.error('Error loading employee:', err);
          toast.push('Failed to load employee.', 'error');
        });
    }
  }, [id, toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName || form.fullName.trim().length < 3) errs.fullName = 'Please enter a valid full name.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    updateEmployee(id, {
      fullName: form.fullName.trim(),
      role: form.role,
      departmentId: form.departmentId ? parseInt(form.departmentId, 10) : null,
      managerId: form.managerId ? parseInt(form.managerId, 10) : null,
      isActive: form.isActive
    })
      .then(() => {
        toast.push('Employee updated successfully.', 'success');
        navigate('/admin/employees');
      })
      .catch(err => toast.push(err.response?.data?.message || 'Failed to update employee.', 'error'));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200/10 bg-white/95 p-6 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Edit Employee</h1>
          </div>
          <span className="inline-flex items-center rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Manage profile</span>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200/10 bg-white/95 p-6 shadow-xl shadow-slate-900/5 max-w-3xl">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full Name</span>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
              {errors.fullName && <p className="mt-2 text-xs text-rose-600">{errors.fullName}</p>}
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Department</span>
              <select
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">Select department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.departmentName}</option>
                ))}
              </select>
            </label>
          </div>

          {form.role === 'Employee' && (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Manager</span>
              <select
                name="managerId"
                value={form.managerId}
                onChange={handleChange}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">Select manager</option>
                {managers.map(m => (
                  <option key={m.id} value={m.id}>{m.fullName}</option>
                ))}
              </select>
            </label>
          )}

          <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sm font-medium text-slate-700">Active employee</span>
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600">Save</button>
            <button type="button" onClick={() => navigate('/admin/employees')} className="rounded-3xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">Cancel</button>
          </div>
        </form>
      </section>
    </div>
  );
}
