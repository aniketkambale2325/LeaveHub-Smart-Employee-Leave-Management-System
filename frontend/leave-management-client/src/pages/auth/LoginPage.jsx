import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginApi({ email: form.email, password: form.password });
      login(data);
      const role = data.role;
      if (role === 'Admin') navigate('/admin/dashboard');
      else if (role === 'Manager') navigate('/manager/dashboard');
      else navigate('/employee/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Invalid email or password. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative mb-12 max-w-xl rounded-[2rem] border border-slate-800/80 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/30 lg:mb-0 lg:flex-1 lg:p-14">
          <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-sky-500/20 blur-3xl"></div>
          <div className="relative space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Welcome back</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Sign in to manage leave activity</h1>
            <p className="max-w-lg text-slate-400">Access your dashboard with secure authentication, role-aware routing, and streamlined HR workflows.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20">
                <p className="text-sm font-semibold text-white">Role-based dashboards</p>
                <p className="mt-2 text-sm text-slate-400">Admin, Manager, and Employee workspaces.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20">
                <p className="text-sm font-semibold text-white">Secure workflow</p>
                <p className="mt-2 text-sm text-slate-400">Protected routes and token-backed authentication.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/40 lg:p-12">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Login</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Enter your credentials</h2>
            <p className="mt-2 text-sm text-slate-400">Use the sample credentials provided or your company account.</p>
          </div>

          {error && (
            <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Email address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@company.com"
                className="w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500" />
                Remember me
              </label>
              <button type="button" className="text-sky-300 hover:text-white">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 text-sm text-slate-400">
            <p className="text-slate-200 font-semibold">Sample Credentials</p>
            <div className="mt-3 grid gap-2 text-sm leading-6">
              <p>Admin: admin@company.com / Admin@123</p>
              <p>Manager: manager@company.com / Manager@123</p>
              <p>Employee: john@company.com / Employee@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
