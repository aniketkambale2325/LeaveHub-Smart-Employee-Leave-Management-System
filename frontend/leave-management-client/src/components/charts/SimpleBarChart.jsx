export default function SimpleBarChart({ data = [], height = 180, color = '#6366f1' }) {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="flex h-full items-end justify-between gap-2" style={{ minHeight: height }}>
      {data.map(item => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-xl transition-all duration-500 hover:opacity-80"
              style={{
                height: `${(item.value / max) * 100}%`,
                minHeight: item.value > 0 ? '8px' : '0',
                background: `linear-gradient(180deg, ${color}, ${color}88)`,
              }}
              title={`${item.label}: ${item.value}`}
            />
          </div>
          <span className="text-[10px] font-medium text-slate-500 sm:text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
