export default function StatCard({ title, value, icon, color = 'indigo', trend, trendLabel }) {
  const colors = {
    indigo: 'from-indigo-500 to-blue-500',
    green: 'from-emerald-500 to-teal-500',
    yellow: 'from-amber-400 to-orange-500',
    red: 'from-rose-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
  };

  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-rose-600 bg-rose-50',
    neutral: 'text-slate-600 bg-slate-100',
  };

  return (
    <div className="group dashboard-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value ?? '—'}</p>
          {trend && (
            <span className={`mt-2 inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${trendColors[trend] || trendColors.neutral}`}>
              {trendLabel || (trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—')}
            </span>
          )}
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colors[color]} text-lg text-white shadow-lg transition group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
