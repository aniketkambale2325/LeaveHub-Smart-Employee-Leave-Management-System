import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icons } from '../components/ui/Icons';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: Icons.Dashboard },
  { to: '/admin/employees', label: 'Employees', icon: Icons.Users },
  { to: '/admin/departments', label: 'Departments', icon: Icons.Building },
  { to: '/admin/leave-types', label: 'Leave Types', icon: Icons.Tag },
  { to: '/admin/leave-requests', label: 'Leave Requests', icon: Icons.Clipboard },
  { to: '/admin/reports', label: 'Reports', icon: Icons.Chart },
  { to: '/admin/profile', label: 'Profile', icon: Icons.User },
  { to: '/admin/settings', label: 'Settings', icon: Icons.Settings },
];

const managerLinks = [
  { to: '/manager/dashboard', label: 'Dashboard', icon: Icons.Dashboard },
  { to: '/manager/pending', label: 'Pending', icon: Icons.Clock },
  { to: '/manager/history', label: 'Team History', icon: Icons.History },
  { to: '/manager/reports', label: 'Reports', icon: Icons.Chart },
  { to: '/manager/profile', label: 'Profile', icon: Icons.User },
  { to: '/manager/settings', label: 'Settings', icon: Icons.Settings },
];

const employeeLinks = [
  { to: '/employee/dashboard', label: 'Dashboard', icon: Icons.Dashboard },
  { to: '/employee/apply-leave', label: 'Apply Leave', icon: Icons.Plus },
  { to: '/employee/my-leaves', label: 'My Leaves', icon: Icons.Clipboard },
  { to: '/employee/balance', label: 'Leave Balance', icon: Icons.Scale },
  { to: '/employee/profile', label: 'Profile', icon: Icons.User },
  { to: '/employee/settings', label: 'Settings', icon: Icons.Settings },
];

function SidebarContent({ links, user, role, logout, collapsed, onClose, onToggleCollapse, isMobile }) {
  return (
    <>
      <div className={`flex items-center border-b border-slate-800/70 ${collapsed && !isMobile ? 'justify-center p-4' : 'gap-3 p-5'}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
          EL
        </div>
        {(!collapsed || isMobile) && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">LeaveHub</p>
            <p className="truncate text-xs text-slate-400">{user?.fullName}</p>
            <span className="mt-1 inline-flex rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
              {role}
            </span>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="hidden rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white md:inline-flex"
            aria-label="Toggle sidebar"
          >
            <span className={`inline-block transition-transform ${collapsed ? 'rotate-180' : ''}`}>
              <Icons.ChevronLeft />
            </span>
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {links.map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              title={collapsed && !isMobile ? link.label : undefined}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${collapsed && !isMobile ? 'justify-center px-2' : ''}`
              }
            >
              <Icon />
              {(!collapsed || isMobile) && <span>{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-800/70 p-3">
        <button
          onClick={() => { onClose?.(); logout(); }}
          className={`sidebar-link w-full text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 ${collapsed && !isMobile ? 'justify-center' : ''}`}
        >
          <Icons.Logout />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ isOpen = false, onClose = () => {}, collapsed = false, onToggleCollapse = () => {} }) {
  const { role, logout, user } = useAuth();
  const links = role === 'Admin' ? adminLinks : role === 'Manager' ? managerLinks : employeeLinks;

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-800/50 bg-slate-950 text-slate-100 shadow-xl transition-all duration-300 md:flex ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <SidebarContent
          links={links}
          user={user}
          role={role}
          logout={logout}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
        />
      </aside>

      <div className={`fixed inset-0 z-40 md:hidden ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
        <div
          className={`absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClose}
        />
        <aside
          className={`absolute left-0 top-0 bottom-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950 transition-transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent
            links={links}
            user={user}
            role={role}
            logout={logout}
            collapsed={false}
            onClose={onClose}
            isMobile
          />
        </aside>
      </div>
    </>
  );
}
