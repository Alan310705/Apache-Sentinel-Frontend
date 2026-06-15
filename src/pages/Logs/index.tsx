import { useState, useMemo } from 'react';
import { Search, ShieldAlert, FileX, Filter, X } from 'lucide-react';
import { useLogs } from '../../hooks/useLogs';
import type { ApacheLog } from '../../types/logs';

type StatusFilter = 'all' | '2xx' | '3xx' | '4xx' | '5xx';
type MethodFilter = 'all' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function getStatusChip(code: number) {
  if (code >= 200 && code < 300) return <span className="status-chip status-2xx">{code}</span>;
  if (code >= 300 && code < 400) return <span className="status-chip status-3xx">{code}</span>;
  if (code >= 400 && code < 500) return <span className="status-chip status-4xx">{code}</span>;
  if (code >= 500)               return <span className="status-chip status-5xx">{code}</span>;
  return <span className="status-chip status-def">{code}</span>;
}

function getMethodStyle(method: string): React.CSSProperties {
  const colors: Record<string, string> = {
    GET:    'var(--green)',
    POST:   'var(--cyan)',
    PUT:    'var(--warn)',
    PATCH:  'var(--warn)',
    DELETE: 'var(--threat)',
  };
  return {
    color: colors[method] ?? 'var(--text-secondary)',
    fontFamily: 'var(--font)',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
  };
}

function matchesStatus(code: number, filter: StatusFilter): boolean {
  if (filter === 'all') return true;
  if (filter === '2xx') return code >= 200 && code < 300;
  if (filter === '3xx') return code >= 300 && code < 400;
  if (filter === '4xx') return code >= 400 && code < 500;
  if (filter === '5xx') return code >= 500;
  return true;
}

export default function Logs() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useLogs(page);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('all');

  const logs: ApacheLog[] = data?.data || [];

  const hasFilters = search.trim() !== '' || statusFilter !== 'all' || methodFilter !== 'all';

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setMethodFilter('all');
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return logs.filter((l) => {
      if (term && !l.ip.toLowerCase().includes(term) && !l.path.toLowerCase().includes(term)) return false;
      if (!matchesStatus(l.statusCode, statusFilter)) return false;
      if (methodFilter !== 'all' && l.method !== methodFilter) return false;
      return true;
    });
  }, [logs, search, statusFilter, methodFilter]);

  return (
    <div className="animate-fadeIn flex flex-col" style={{ height: '100%', gap: '1.25rem' }}>

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">
            <span className="page-title-prefix">//</span>
            Logs Explorer
          </h1>
          <p className="page-subtitle">Real-time Apache access log inspection</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="term-panel" style={{ padding: '0.75rem 1rem' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={13} style={{ color: 'var(--cyan)', flexShrink: 0 }} />

          {/* Text search */}
          <div className="search-wrap" style={{ flex: '1', minWidth: '180px' }}>
            <Search className="search-icon" size={13} />
            <input
              id="log-search"
              type="text"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="filter by IP or path..."
            />
          </div>

          {/* Status filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>STATUS</span>
            {(['all', '2xx', '3xx', '4xx', '5xx'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font)',
                  fontWeight: 600,
                  borderRadius: '3px',
                  border: `1px solid ${statusFilter === s ? 'var(--cyan)' : 'rgba(255,255,255,0.07)'}`,
                  background: statusFilter === s ? 'rgba(139,233,253,0.12)' : 'transparent',
                  color: statusFilter === s ? 'var(--cyan)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Method filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>METHOD</span>
            {(['all', 'GET', 'POST', 'PUT', 'DELETE'] as MethodFilter[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                style={{
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font)',
                  fontWeight: 600,
                  borderRadius: '3px',
                  border: `1px solid ${methodFilter === m ? 'var(--cyan)' : 'rgba(255,255,255,0.07)'}`,
                  background: methodFilter === m ? 'rgba(139,233,253,0.12)' : 'transparent',
                  color: methodFilter === m
                    ? 'var(--cyan)'
                    : m === 'GET' ? 'var(--green)'
                    : m === 'POST' ? 'var(--cyan)'
                    : m === 'DELETE' ? 'var(--threat)'
                    : m === 'PUT' ? 'var(--warn)'
                    : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.2rem 0.6rem',
                fontSize: '0.68rem',
                fontFamily: 'var(--font)',
                border: '1px solid rgba(255,85,85,0.3)',
                borderRadius: '3px',
                background: 'rgba(255,85,85,0.08)',
                color: 'var(--threat)',
                cursor: 'pointer',
              }}
            >
              <X size={11} /> clear
            </button>
          )}
        </div>
      </div>

      {/* Table panel */}
      <div className="term-panel flex-1 flex flex-col overflow-hidden">
        <div className="term-panel-header">
          <span className="term-panel-title">
            <span className="term-panel-title-prefix">$</span>
            access_log
          </span>
          <div className="status-live">
            <span className="status-live-dot" />
            LIVE
          </div>
        </div>

        <div className="term-table-wrap" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="term-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>IP Address</th>
                <th>Method</th>
                <th>Path</th>
                <th>Status</th>
                <th>User Agent</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    loading access logs...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <FileX size={40} className="empty-state-icon" />
                      {hasFilters ? (
                        <>
                          <p className="empty-state-title">No logs match the current filters</p>
                          <p className="empty-state-desc">Try adjusting status, method, or the search term.</p>
                        </>
                      ) : (
                        <>
                          <p className="empty-state-title">No logs recorded yet</p>
                          <p className="empty-state-desc">Entries will appear as Apache traffic reaches the backend.</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap" style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'var(--font)' }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="td-ip whitespace-nowrap">{log.ip}</td>
                    <td>
                      <span style={getMethodStyle(log.method)}>{log.method}</span>
                    </td>
                    <td
                      className="td-truncate td-mono"
                      style={{ fontSize: '0.75rem', maxWidth: '280px', color: 'var(--text-secondary)' }}
                      title={log.path}
                    >
                      {log.path}
                    </td>
                    <td className="whitespace-nowrap">
                      {getStatusChip(log.statusCode)}
                      {log.statusCode === 503 && (
                        <span title="Panic Mode load-shed">
                          <ShieldAlert
                            size={12}
                            style={{ display: 'inline', marginLeft: '0.35rem', color: 'var(--threat)', verticalAlign: 'middle' }}
                          />
                        </span>
                      )}
                    </td>
                    <td
                      className="td-truncate"
                      style={{ fontSize: '0.7rem', color: 'var(--text-muted)', maxWidth: '180px' }}
                      title={log.userAgent}
                    >
                      {log.userAgent || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="term-panel-footer">
          <span>
            {filtered.length}{hasFilters ? ` of ${logs.length}` : ''} entr{filtered.length !== 1 ? 'ies' : 'y'}
            {statusFilter !== 'all' && <span style={{ color: 'var(--cyan)', marginLeft: '0.4rem' }}>· status: {statusFilter}</span>}
            {methodFilter !== 'all' && <span style={{ color: 'var(--cyan)', marginLeft: '0.4rem' }}>· method: {methodFilter}</span>}
            {search && <span style={{ color: 'var(--cyan)', marginLeft: '0.4rem' }}>· search: "{search}"</span>}
          </span>
          <span>auto-refresh 5s</span>
        </div>
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="pagination-controls" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '3px'
        }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            ← Prev
          </button>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Page {data.pagination.page} of {data.pagination.totalPages}
            {' '}({data.pagination.total.toLocaleString()} total)
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
            disabled={page >= data.pagination.totalPages}
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
}