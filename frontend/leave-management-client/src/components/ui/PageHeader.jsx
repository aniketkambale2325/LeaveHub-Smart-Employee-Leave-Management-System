export default function PageHeader({ eyebrow, title, description, badge, actions }) {
  return (
    <section className="dashboard-card animate-fade-in p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">{eyebrow}</p>
          )}
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
          {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {badge && (
            <span className="inline-flex items-center rounded-2xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              {badge}
            </span>
          )}
          {actions}
        </div>
      </div>
    </section>
  );
}
