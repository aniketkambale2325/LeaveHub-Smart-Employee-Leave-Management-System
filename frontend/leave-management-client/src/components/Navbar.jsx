import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Icons } from './ui/Icons';

const routeTitles = {
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/employees': 'Employee Management',
  '/admin/employees/add': 'Add Employee',
  '/admin/departments': 'Departments',
  '/admin/leave-types': 'Leave Types',
  '/admin/leave-requests': 'Leave Requests',
  '/admin/reports': 'Reports & Analytics',
  '/admin/profile': 'Profile',
  '/admin/settings': 'Settings',
  '/manager/dashboard': 'Manager Dashboard',
  '/manager/pending': 'Pending Requests',
  '/manager/history': 'Team Leave History',
  '/manager/reports': 'Reports & Analytics',
  '/manager/profile': 'Profile',
  '/manager/settings': 'Settings',
  '/employee/dashboard': 'Employee Dashboard',
  '/employee/apply-leave': 'Apply Leave',
  '/employee/my-leaves': 'My Leaves',
  '/employee/balance': 'Leave Balance',
  '/employee/profile': 'Profile',
  '/employee/settings': 'Settings',
};

export default function Navbar({ onOpenMenu = () => {} }) {
  const { user, logout, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const title = useMemo(() => {
    if (routeTitles[location.pathname]) return routeTitles[location.pathname];
    if (location.pathname.includes('/employees/edit/')) return 'Edit Employee';
    return 'Dashboard';
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onOpenMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 md:hidden"
            aria-label="Open menu"
          >
            <Icons.Menu />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
            <p className="truncate text-xs text-slate-500">
              Welcome back, {user?.fullName?.split(' ')[0] || 'User'}
            </p>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center px-4 md:flex">
          <div className="relative w-full max-w-md">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              <Icons.Search />
            </span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
          </button>
          <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 sm:inline-flex">
            <Icons.Bell />
          </button>
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white shadow-md shadow-indigo-500/25"
          >
            {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-12 z-20 w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <p className="text-sm font-semibold text-slate-800">{user?.fullName}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <span className="mt-2 inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
                  {role}
                </span>
                <button
                  onClick={logout}
                  className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
