import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    approvals: true,
    reminders: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('notification-settings', JSON.stringify(notifications));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Customize your theme, notifications, and security preferences."
      />

      <Card>
        <h3 className="text-lg font-semibold text-slate-900">Theme</h3>
        <p className="mt-1 text-sm text-slate-500">Choose your preferred appearance.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {['light', 'dark'].map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded-2xl border px-5 py-3 text-sm font-semibold capitalize transition ${
                theme === t
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t} mode
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
        <p className="mt-1 text-sm text-slate-500">Control how you receive updates.</p>
        <div className="mt-4 space-y-3">
          {[
            { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
            { key: 'push', label: 'Push notifications', desc: 'Browser push alerts' },
            { key: 'approvals', label: 'Approval alerts', desc: 'Leave approval status changes' },
            { key: 'reminders', label: 'Balance reminders', desc: 'Low leave balance warnings' },
          ].map(item => (
            <label
              key={item.key}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-white"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={e => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-slate-900">Security</h3>
        <p className="mt-1 text-sm text-slate-500">Manage your account security settings.</p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-slate-800">Two-factor authentication</p>
            <p className="text-xs text-slate-500">Coming soon — extra security for your account</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-slate-800">Session timeout</p>
            <p className="text-xs text-slate-500">JWT tokens expire after 7 days</p>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>Save Preferences</Button>
        {saved && <span className="text-sm font-medium text-emerald-600">Settings saved!</span>}
      </div>
    </div>
  );
}
