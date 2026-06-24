export default function Input({ label, error, hint, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      <input
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-500"
        {...props}
      />
      {hint && !error && <p className="mt-1.5 text-xs text-indigo-600">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </label>
  );
}

export function TextArea({ label, error, maxLength, value, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          {maxLength && (
            <span className="text-xs text-slate-400">{String(value || '').length}/{maxLength}</span>
          )}
        </div>
      )}
      <textarea
        value={value}
        maxLength={maxLength}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </label>
  );
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      <select
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </label>
  );
}
