import { Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid rgba(0,255,65,0.08)',
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'rgba(0,255,65,0.4)' }}>&gt;</span>{' '}
            {user?.username ?? '---'}
          </span>
          <button onClick={logout} className="btn btn-ghost btn-sm">
            <LogOut size={14} />
            logout
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}