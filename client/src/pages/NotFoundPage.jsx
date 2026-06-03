import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi2';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-apple-parchment flex items-center justify-center p-6">
      <div className="text-center">
        {/* Floating 404 */}
        <div className="relative inline-block mb-8">
          <h1
            className="text-[10rem] sm:text-[12rem] font-extrabold text-apple-blue leading-none select-none"
            style={{
              animation: 'float404 3s ease-in-out infinite',
            }}
          >
            404
          </h1>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-apple-blue/5 blur-3xl -z-10 rounded-full" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold text-apple-ink mb-3">
          Page Not Found
        </h2>
        <p className="text-apple-ink-48 text-lg mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>

        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base font-semibold"
        >
          <HiHome className="w-5 h-5" />
          Go to Dashboard
        </Link>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes float404 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
