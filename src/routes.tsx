import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Firewall from './pages/Firewall';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';

// Auth wrapper that provides context AND renders children
function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Login route - auth not needed, use separate wrapper
function LoginWrapper() {
  return (
    <AuthWrapper>
      <Login />
    </AuthWrapper>
  );
}

// Protected layout wrapper
function ProtectedLayout() {
  return (
    <AuthWrapper>
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    </AuthWrapper>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginWrapper />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'logs', element: <Logs /> },
      { path: 'firewall', element: <Firewall /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
