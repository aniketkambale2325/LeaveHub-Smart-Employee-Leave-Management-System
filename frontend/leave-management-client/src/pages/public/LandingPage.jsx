import { Link } from 'react-router-dom';
import { useState } from 'react';

const features = [
  { title: 'Leave Application', description: 'Submit leave requests with a modern workflow and approval visibility.' },
  { title: 'Approval Workflow', description: 'Approve, reject, or review requests with fast manager actions.' },
  { title: 'Leave Balance Tracking', description: 'Keep employee balances visible and reduce unexpected time off.' },
  { title: 'Employee Management', description: 'Manage users, roles, departments, and organization data.' },
  { title: 'Reports & Analytics', description: 'Track trends with data-driven leave and team insights.' },
  { title: 'Role Based Access Control', description: 'Secure dashboards for Admin, Manager, and Employee users.' },
];

const stats = [
  { value: '1000+', label: 'Leave Requests Processed' },
  { value: '500+', label: 'Employees Managed' },
  { value: '99.9%', label: 'Reliability' },
  { value: 'Real-time', label: 'Tracking' },
];

const benefits = [
  { title: 'Faster Approvals', description: 'Streamline review with simple approval actions and visibility.' },
  { title: 'Transparent Process', description: 'Keep employees informed with clear leave status updates.' },
  { title: 'Better Workforce Planning', description: 'Reduce gaps using balance tracking and reporting.' },
  { title: 'Reduced HR Workload', description: 'Automate processes and reduce manual leave administration.' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/25">
              EL
            </div>
            <div>
              <p className="text-sm font-bold text-white">LeaveHub</p>
              <p className="text-xs text-slate-500">Intelligent leave management</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#home" className="transition hover:text-white">Home</a>
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#about" className="transition hover:text-white">About</a>
            <a href="#contact" className="transition hover:text-white">Contact</a>
            <Link to="/login" className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90">Login</Link>
          </nav>
          <button onClick={() => setMenuOpen(o => !o)} className="rounded-xl border border-slate-700 p-2 text-slate-300 md:hidden" aria-label="Menu">
            ☰
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-slate-800 px-6 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm">
              <a href="#home" onClick={() => setMenuOpen(false)} className="text-slate-300">Home</a>
              <a href="#features" onClick={() => setMenuOpen(false)} className="text-slate-300">Features</a>
              <a href="#about" onClick={() => setMenuOpen(false)} className="text-slate-300">About</a>
              <Link to="/login" className="rounded-2xl bg-indigo-600 px-4 py-2 text-center font-semibold text-white">Login</Link>
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 pb-20 sm:px-8">
        <section id="home" className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="max-w-xl space-y-4">
              <p className="inline-flex rounded-full bg-slate-800/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Enterprise-grade HR</p>
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">Smart Employee Leave Management</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">Manage employee leave requests, approvals, balances, and workforce productivity from one intelligent platform.</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/login" className="inline-flex items-center justify-center rounded-3xl bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400">Get Started</Link>
              <Link to="/login" className="inline-flex items-center justify-center rounded-3xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-slate-600 hover:bg-slate-800">Login</Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(stat => (
                <div key={stat.label} className="rounded-3xl border border-slate-800/70 bg-slate-900/90 p-6 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.8)] backdrop-blur-xl">
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-900 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-slate-950/40">
            <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-sky-500/20 blur-3xl"></div>
            <div className="absolute -right-20 top-24 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
            <div className="relative rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between text-slate-300">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Live dashboard</p>
                  <p className="mt-2 text-lg font-semibold text-white">Workforce overview</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-slate-800/80 ring-1 ring-white/10"></div>
              </div>

              <div className="space-y-4 rounded-3xl bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Leave Requests</span>
                  <span className="font-semibold text-white">1.2k</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800">
                  <div className="h-3 w-3/4 rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-violet-500"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                  <div>
                    <p className="text-white font-semibold">78%</p>
                    <p>Approval rate</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold">24h</p>
                    <p>Response time</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 pt-4 sm:grid-cols-2">
                {['Pending', 'Approved', 'Rejected', 'Balance'].map((tile, index) => (
                  <div key={tile} className="rounded-3xl border border-white/10 bg-slate-950/90 p-4 text-sm text-slate-300 shadow-lg shadow-slate-950/20">
                    <p className="font-semibold text-white">{tile}</p>
                    <p className="mt-2 text-3xl text-sky-300">{index === 0 ? '142' : index === 1 ? '860' : index === 2 ? '32' : '14d'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-20">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Features</p>
            <h2 className="text-4xl font-semibold text-white">Built for teams, managers, and HR leaders</h2>
            <p className="max-w-2xl mx-auto text-slate-400">A complete leave management platform with advanced workflows, approvals, and reporting for every role.</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {features.map(feature => (
              <div key={feature.title} className="group rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-sky-500/40 hover:bg-slate-900 shadow-2xl shadow-slate-950/20">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20">
                  <span className="text-xl">★</span>
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="mt-20 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Why choose us</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Modern leave management for every organization.</h2>
            <p className="mt-5 text-slate-400 leading-8">From leave requests to manager approvals and balance tracking, our platform gives your team the visibility and controls needed to reduce absenteeism and improve planning.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map(benefit => (
                <div key={benefit.title} className="rounded-3xl bg-slate-950/80 p-5 text-slate-300 ring-1 ring-white/5">
                  <p className="font-semibold text-white">{benefit.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/80 p-6 text-white shadow-inner shadow-slate-950/20">
                <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Performance</p>
                <p className="mt-4 text-3xl font-semibold">99.9%</p>
                <p className="mt-2 text-sm text-slate-400">Reliable leave tracking and approval workflows.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-6 text-white shadow-inner shadow-slate-950/20">
                <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Security</p>
                <p className="mt-4 text-3xl font-semibold">Role-based</p>
                <p className="mt-2 text-sm text-slate-400">Access control for employees, managers, and admins.</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6 text-slate-300 shadow-xl shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Live preview</p>
              <div className="mt-5 grid gap-4 rounded-3xl bg-slate-900/80 p-5 text-sm text-slate-400">
                <div className="flex items-center justify-between rounded-3xl bg-slate-950/90 p-4">
                  <div>
                    <p className="text-slate-300">Monthly leave usage</p>
                    <p className="mt-2 text-xl font-semibold text-white">84%</p>
                  </div>
                  <div className="rounded-2xl bg-sky-500/10 px-3 py-2 text-sky-300">Live</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/90 p-4">Department leave trends</div>
                  <div className="rounded-3xl bg-slate-950/90 p-4">Approval analytics</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-slate-800/70 bg-slate-950/90 px-6 py-10 text-slate-400 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-4">
            <p className="text-xl font-semibold text-white">EmployeeLeave</p>
            <p className="text-sm text-slate-400">A modern leave management experience for teams, HR, and leadership.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <p className="font-semibold text-white">Quick Links</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                <li><a href="#home" className="transition hover:text-white">Home</a></li>
                <li><a href="#features" className="transition hover:text-white">Features</a></li>
                <li><a href="#about" className="transition hover:text-white">About</a></li>
                <li><Link to="/login" className="transition hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white">Contact</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                <li>support@employeeleave.com</li>
                <li>+1 (800) 123-4567</li>
                <li>123 Enterprise Blvd</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800/70 pt-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 EmployeeLeave</span>
          <div className="flex items-center gap-3 text-slate-500">
            <a href="#" className="transition hover:text-white">LinkedIn</a>
            <a href="#" className="transition hover:text-white">Twitter</a>
            <a href="#" className="transition hover:text-white">Facebook</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
