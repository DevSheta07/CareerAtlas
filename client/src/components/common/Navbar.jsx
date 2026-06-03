import { HiBars3 } from 'react-icons/hi2';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar({ title, onMenuClick }) {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-apple-parchment/80 backdrop-blur-xl backdrop-saturate-[180%] border-b border-apple-divider">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-apple-sm text-apple-ink-48 hover:text-apple-ink hover:bg-apple-parchment transition-colors"
            aria-label="Open menu"
          >
            <HiBars3 className="w-6 h-6" />
          </button>

          {/* Page Title */}
          <div>
            <h1 className="text-apple-tagline text-apple-ink">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <p className="text-sm text-apple-ink-48">
              Welcome,{' '}
              <span className="text-apple-ink font-semibold">
                {user?.name || 'User'}
              </span>
            </p>
            <span
              className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-apple-pill ${
                isAdmin
                  ? 'bg-apple-blue/10 text-apple-blue'
                  : 'bg-apple-ink/5 text-apple-ink-48'
              }`}
            >
              {user?.role || 'user'}
            </span>
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-apple-blue flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
