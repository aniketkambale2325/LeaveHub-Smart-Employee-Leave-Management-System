import { useMemo, useState } from 'react';

export default function DataTable({
  data = [],
  columns = [],
  searchKeys = ['fullName', 'email'],
  actionsSlot = null,
  defaultPageSize = 10,
}) {
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [colFilters, setColFilters] = useState({});

  const filtered = useMemo(() => {
    const search = q.trim().toLowerCase();
    return data.filter(item => {
      if (search && !searchKeys.some(key => String(item[key] ?? '').toLowerCase().includes(search))) return false;
      for (const [key, value] of Object.entries(colFilters)) {
        if (value == null || value === '') continue;
        const cell = item[key];
        const column = columns.find(col => col.key === key);
        if (column && Array.isArray(column.filterOptions) && column.filterOptions.length > 0) {
          if (String(cell ?? '') !== String(value)) return false;
        } else {
          if (!String(cell ?? '').toLowerCase().includes(String(value).toLowerCase())) return false;
        }
      }
      return true;
    });
  }, [data, q, searchKeys, colFilters, columns]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const column = columns.find(col => col.key === sortKey);
    return [...filtered].sort((a, b) => {
      const va = column && column.sortAccessor ? column.sortAccessor(a) : a[sortKey];
      const vb = column && column.sortAccessor ? column.sortAccessor(b) : b[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return sortDir === 'asc' ? -1 : 1;
      if (vb == null) return sortDir === 'asc' ? 1 : -1;
      if (typeof va === 'number' && typeof vb === 'number') return sortDir === 'asc' ? va - vb : vb - va;
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [filtered, sortKey, sortDir, columns]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const toggleSort = key => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir(null);
    }
    setPage(1);
  };

  const setFilter = (key, value) => {
    setColFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-white flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1); }}
            placeholder="Search"
            className="w-full sm:w-64 rounded-3xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>
        <div>{actionsSlot}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-700">
          <thead className="bg-slate-100 text-slate-500 uppercase tracking-[0.08em] text-xs">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left font-semibold">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={col.sortable === false}
                      onClick={() => col.sortable !== false && toggleSort(col.key)}
                      className="inline-flex items-center gap-2"
                    >
                      {col.label}
                      {sortKey === col.key && <span className="text-xs text-slate-400">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </div>
                  {col.filterOptions ? (
                    <select
                      value={colFilters[col.key] ?? ''}
                      onChange={e => setFilter(col.key, e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-2 py-1 text-sm"
                    >
                      <option value="">All</option>
                      {col.filterOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : col.filterable ? (
                    <input
                      value={colFilters[col.key] ?? ''}
                      onChange={e => setFilter(col.key, e.target.value)}
                      placeholder={`Filter ${col.label}`}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-2 py-1 text-sm"
                    />
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">No records found.</td>
              </tr>
            ) : (
              paged.map(row => (
                <tr key={row.id ?? JSON.stringify(row)} className="hover:bg-slate-50 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-4 align-top">
                      {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t bg-slate-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2"
          >
            {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 justify-end">
          <span>{total} records</span>
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 disabled:opacity-50"
          >
            Prev
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
