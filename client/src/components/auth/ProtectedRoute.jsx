import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();

  // Loading state - full-screen spinner
  if (loading) {
    return (
      <div className="fixed inset-0 bg-apple-parchment flex flex-col items-center justify-center z-50">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-apple-hairline" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-apple-blue animate-spin" />
        </div>
        <p className="mt-6 text-sm text-apple-ink-48 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Not admin but admin-only route
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Authorized - render children
  return children;
}
