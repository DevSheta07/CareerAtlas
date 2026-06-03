import { NavLink } from 'react-router-dom';
import {
  HiAcademicCap,
  HiHome,
  HiUserGroup,
  HiBriefcase,
  HiCalendarDays,
  HiArrowRightOnRectangle,
  HiXMark,
  HiCheckCircle,
  HiUser,
} from 'react-icons/hi2';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', icon: HiHome, path: '/dashboard' },
  { label: 'Students', icon: HiUserGroup, path: '/students' },
  { label: 'Placements', icon: HiBriefcase, path: '/placements' },
  { label: 'Higher Studies', icon: HiAcademicCap, path: '/higher-studies' },
  { label: 'Drives', icon: HiCalendarDays, path: '/drives' },
];

const adminOnlyItems = [
  { label: 'Approvals', icon: HiCheckCircle, path: '/approvals' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth();

  const allNavItems = isAdmin
    ? [...navItems, ...adminOnlyItems]
    : [...navItems, { label: 'My Profile', icon: HiUser, path: '/profile' }];

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white w-64 border-r border-apple-divider">
      {/* Logo Section */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-apple-divider">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-apple-sm bg-apple-blue">
            <HiAcademicCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-apple-ink tracking-tight">CareerAtlas</span>
        </div>
        {/* Close button - mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-apple-sm text-apple-ink-48 hover:text-apple-ink hover:bg-apple-parchment transition-colors"
          aria-label="Close sidebar"
        >
          <HiXMark className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {allNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-apple-sm transition-all duration-200 group ${
                isActive
                  ? 'text-apple-blue bg-apple-blue/[0.08] font-semibold'
                  : 'text-apple-ink-80 hover:text-apple-ink hover:bg-apple-parchment'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? 'text-apple-blue'
                      : 'text-apple-ink-48 group-hover:text-apple-ink'
                  }`}
                />
                <span className="text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info Card */}
      <div className="p-4 border-t border-apple-divider">
        <div className="bg-apple-parchment rounded-apple-sm p-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-apple-sm bg-apple-blue flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-apple-ink truncate">
                {user?.name || 'User'}
              </p>
              <span
                className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-apple-pill ${
                  isAdmin
                    ? 'bg-apple-blue/10 text-apple-blue'
                    : 'bg-apple-ink/5 text-apple-ink-48'
                }`}
              >
                {user?.role || 'user'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-apple-sm text-sm text-apple-ink-48 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <HiArrowRightOnRectangle className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          {/* Sidebar Panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 animate-slide-right shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
