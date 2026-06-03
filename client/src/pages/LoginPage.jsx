import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signupUser } from '../services/api';
import toast from 'react-hot-toast';
import {
  HiChartBar,
  HiUserGroup,
  HiAcademicCap,
  HiBriefcase,
  HiEye,
  HiEyeSlash,
  HiCheckCircle,
} from 'react-icons/hi2';

const features = [
  {
    icon: HiChartBar,
    title: 'Real-time Analytics',
    description: 'Track placement statistics and trends with interactive dashboards',
  },
  {
    icon: HiUserGroup,
    title: 'Student Management',
    description: 'Manage student records, profiles, and placement status efficiently',
  },
  {
    icon: HiAcademicCap,
    title: 'Higher Studies Tracking',
    description: 'Monitor students pursuing higher education worldwide',
  },
  {
    icon: HiBriefcase,
    title: 'Placement Drives',
    description: 'Coordinate recruitment drives, track schedules, and applications',
  },
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', enrollmentNo: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggleMode = () => {
    setIsSignup((prev) => !prev);
    setSignupSuccess(false);
    setForm({ name: '', email: '', password: '', phone: '', enrollmentNo: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone || !form.enrollmentNo) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signupUser({ name: form.name, email: form.email, password: form.password, phone: form.phone, enrollmentNo: form.enrollmentNo });
      setSignupSuccess(true);
      toast.success('Account created! Awaiting admin approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel — Feature showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-apple-parchment flex-col justify-center items-center p-12 relative">
        <div className="relative z-10 max-w-lg">
          {/* Logo & Tagline */}
          <div className="mb-14">
            <Link to="/" className="flex items-center gap-3 mb-5 hover:opacity-80 transition-opacity w-fit">
              <div className="p-2.5 rounded-apple-sm bg-apple-blue">
                <HiChartBar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-apple-ink tracking-tight" style={{ letterSpacing: '-0.28px' }}>
                  CareerAtlas
                </h1>
                <p className="text-apple-ink-48 text-sm">Placement & Higher Studies Portal</p>
              </div>
            </Link>
            <p className="text-apple-ink-80 text-lg leading-relaxed" style={{ fontSize: '17px', lineHeight: '1.47', letterSpacing: '-0.374px' }}>
              Streamline your institution's placement tracking with powerful analytics,
              comprehensive reporting, and real-time insights.
            </p>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-5">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4 group">
                <div className="p-2.5 rounded-apple-sm bg-apple-blue/[0.08] group-hover:bg-apple-blue/[0.12] transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-apple-blue" />
                </div>
                <div>
                  <h3 className="text-apple-ink font-semibold text-sm mb-0.5">{feature.title}</h3>
                  <p className="text-apple-ink-48 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login / Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-white relative">
        <Link
          to="/"
          className="absolute top-6 right-6 text-sm font-semibold text-apple-blue hover:text-apple-blue-focus transition-colors flex items-center gap-1 group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-8 justify-center hover:opacity-80 transition-opacity">
            <div className="p-2 rounded-apple-sm bg-apple-blue">
              <HiChartBar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-apple-ink tracking-tight">CareerAtlas</h1>
          </Link>

          <div className="bg-white border border-apple-hairline rounded-apple-lg p-8">
            {/* Signup success state */}
            {signupSuccess ? (
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mb-4">
                  <HiCheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-semibold text-apple-ink mb-2">Account Created!</h2>
                <p className="text-apple-ink-48 mb-6 leading-relaxed" style={{ fontSize: '17px', lineHeight: '1.47' }}>
                  Your account has been created successfully. An administrator will review and approve your
                  account shortly. You'll be able to log in once approved.
                </p>
                <button
                  onClick={handleToggleMode}
                  className="btn-primary px-6 py-2.5 text-sm font-semibold"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-apple-ink mb-2" style={{ letterSpacing: '-0.28px' }}>
                    {isSignup ? 'Create an account' : 'Welcome back'}
                  </h2>
                  <p className="text-apple-ink-48" style={{ fontSize: '17px', lineHeight: '1.47', letterSpacing: '-0.374px' }}>
                    {isSignup
                      ? 'Sign up to request portal access'
                      : 'Sign in to your account to continue'}
                  </p>
                </div>

                <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-5">
                  {/* Name field — signup only */}
                  {isSignup && (
                    <>
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-apple-ink mb-2">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          className="input-field w-full"
                          placeholder="John Doe"
                          autoComplete="name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-apple-ink mb-2">
                          Mobile Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          className="input-field w-full"
                          placeholder="1234567890"
                          autoComplete="tel"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="enrollmentNo" className="block text-sm font-semibold text-apple-ink mb-2">
                          Enrollment Number
                        </label>
                        <input
                          id="enrollmentNo"
                          name="enrollmentNo"
                          type="text"
                          value={form.enrollmentNo}
                          onChange={handleChange}
                          className="input-field w-full"
                          placeholder="EN2024001"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-apple-ink mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-apple-ink mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={handleChange}
                        className="input-field w-full pr-12"
                        placeholder="••••••••"
                        autoComplete={isSignup ? 'new-password' : 'current-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-ink-48 hover:text-apple-ink transition-colors"
                      >
                        {showPassword ? (
                          <HiEyeSlash className="w-5 h-5" />
                        ) : (
                          <HiEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {isSignup && (
                      <p className="text-apple-ink-48 text-xs mt-1.5">Must be at least 6 characters</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {isSignup ? 'Creating account...' : 'Signing in...'}
                      </>
                    ) : (
                      isSignup ? 'Create Account' : 'Sign In'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-apple-ink-48 text-sm">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      onClick={handleToggleMode}
                      className="text-apple-blue hover:text-apple-blue-focus font-semibold transition-colors"
                    >
                      {isSignup ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>

          <p className="text-center text-apple-ink-48 text-xs mt-6">
            &copy; {new Date().getFullYear()} CareerAtlas. All rights reserved. Created by Dev Sheta.
          </p>
        </div>
      </div>
    </div>
  );
}
