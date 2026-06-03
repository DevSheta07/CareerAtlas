import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import PlacementsPage from './pages/PlacementsPage';
import HigherStudiesPage from './pages/HigherStudiesPage';
import DrivesPage from './pages/DrivesPage';
import ApprovalsPage from './pages/ApprovalsPage';
import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import { useState } from 'react';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/students': 'Students',
  '/placements': 'Placements',
  '/higher-studies': 'Higher Studies',
  '/drives': 'Placement Drives',
  '/approvals': 'Pending Approvals',
  '/profile': 'My Profile',
};

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-apple-parchment">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          title={pageTitle}
        />
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Login — no layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes with layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Layout>
              <StudentsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/placements"
        element={
          <ProtectedRoute>
            <Layout>
              <PlacementsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/higher-studies"
        element={
          <ProtectedRoute>
            <Layout>
              <HigherStudiesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/drives"
        element={
          <ProtectedRoute>
            <Layout>
              <DrivesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/approvals"
        element={
          <ProtectedRoute adminOnly>
            <Layout>
              <ApprovalsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 — no layout */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#1d1d1f',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            },
            success: {
              iconTheme: {
                primary: '#34c759',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff3b30',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
