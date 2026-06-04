import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  HiChartBar,
  HiUserGroup,
  HiAcademicCap,
  HiBriefcase,
  HiCheckCircle,
  HiShieldCheck,
  HiArrowRight,
} from 'react-icons/hi2';

export default function LandingPage() {
  const { user } = useAuth();
  const [bannerDismissed, setBannerDismissed] = useState(
    () => localStorage.getItem('browser-banner-dismissed') === 'true'
  );

  const handleDismissBanner = () => {
    localStorage.setItem('browser-banner-dismissed', 'true');
    setBannerDismissed(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans antialiased selection:bg-apple-blue/20 selection:text-apple-blue">
      {!bannerDismissed && (
        <div className="bg-[#fff8e6] border-b border-[#ffe5a3] text-[#7a5300] text-xs py-2.5 px-6 flex items-center justify-between transition-all duration-300 z-50 relative">
          <div className="flex items-center gap-2 mx-auto">
            <span>🌐</span>
            <span className="font-medium text-center">For the best experience, we recommend using a desktop web browser.</span>
          </div>
          <button 
            onClick={handleDismissBanner}
            className="text-[#7a5300]/60 hover:text-[#7a5300] text-sm font-semibold focus:outline-none ml-2"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
      {/* Pinned Sub-nav (Frosted Sub-nav styling from DESIGN.md) */}
      <nav className="sticky top-0 z-50 bg-[#f5f5f7]/80 backdrop-blur-xl backdrop-saturate-[180%] border-b border-apple-hairline transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded bg-apple-blue">
              <HiAcademicCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-apple-ink">CareerAtlas</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="text-xs text-apple-ink-48 hover:text-apple-ink transition-colors">Features</a>
            <a href="#drives" className="text-xs text-apple-ink-48 hover:text-apple-ink transition-colors">Drives</a>
            <a href="#security" className="text-xs text-apple-ink-48 hover:text-apple-ink transition-colors">Security</a>
            
            {user ? (
              <Link to="/dashboard" className="btn-primary px-4 py-1.5 text-xs font-semibold">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn-primary px-4 py-1.5 text-xs font-semibold flex items-center gap-1 group">
                Sign In
                <HiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-white py-24 sm:py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-apple-blue mb-4 block animate-fade-in">
            Next Generation Placement Suite
          </span>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-apple-ink leading-[1.07] mb-6 animate-fade-in">
            The future of college placement tracking.<br />
            <span className="text-apple-blue">Impossibly clean.</span>
          </h1>
          <p className="text-lg sm:text-xl text-apple-ink-48 max-w-2xl mx-auto mb-10 leading-[1.47] tracking-tight animate-fade-in">
            A beautiful, unified workspace designed for academic institutions to monitor real-time placement stats, higher studies admissions, and active recruitment drives.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in">
            {user ? (
              <Link to="/dashboard" className="btn-primary py-3 px-6 text-base font-semibold">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn-primary py-3 px-6 text-base font-semibold">
                Enter Placement Portal
              </Link>
            )}
            <a href="#features" className="text-apple-blue hover:text-apple-blue-focus font-semibold flex items-center gap-1 group transition-all">
              See how it works
              <HiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </header>

      {/* alternating product tiles (per DESIGN.md instructions) */}
      <section id="features" className="divide-y divide-apple-hairline">
        
        {/* Tile 1: Light canvas - Analytics */}
        <div className="bg-white py-24 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-10 h-10 rounded-xl bg-apple-blue/10 flex items-center justify-center text-apple-blue">
                <HiChartBar className="w-5 h-5" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1] text-apple-ink">
                Real-time Analytics.<br />At a glance.
              </h2>
              <p className="text-apple-ink-48 text-base leading-[1.47] tracking-tight">
                Instantly monitor overall placement percentages, average packages (LPA), and students heading for higher studies. Make data-driven institutional decisions with built-in interactive charts.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-sm text-apple-ink-80">
                  <HiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Company-wise placement distribution histograms</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-apple-ink-80">
                  <HiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Branch-wise student career selection breakdowns</span>
                </li>
              </ul>
            </div>
            <div className="glass-card p-6 bg-[#f5f5f7] border border-apple-hairline rounded-apple-lg shadow-md aspect-video flex items-center justify-center relative overflow-hidden">
              {/* Decorative mini dashboard layout */}
              <div className="w-full h-full flex flex-col justify-between">
                <div className="flex gap-4">
                  <div className="bg-white p-4 rounded-apple-md border border-apple-hairline flex-1">
                    <p className="text-xs text-apple-ink-48">Placement Rate</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">84.2%</p>
                  </div>
                  <div className="bg-white p-4 rounded-apple-md border border-apple-hairline flex-1">
                    <p className="text-xs text-apple-ink-48">Avg Package</p>
                    <p className="text-xl font-bold text-apple-blue mt-1">₹12.4 LPA</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-apple-md border border-apple-hairline flex-1 mt-4 flex items-end justify-between gap-1 h-32">
                  <div className="bg-apple-blue/20 rounded-t-sm w-full h-1/3"></div>
                  <div className="bg-apple-blue/40 rounded-t-sm w-full h-1/2"></div>
                  <div className="bg-apple-blue/60 rounded-t-sm w-full h-3/4"></div>
                  <div className="bg-apple-blue rounded-t-sm w-full h-full"></div>
                  <div className="bg-apple-blue/80 rounded-t-sm w-full h-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tile 2: Dark canvas - Drives */}
        <div id="drives" className="bg-[#272729] py-24 px-6 text-white overflow-hidden">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2 space-y-6">
              <div className="w-10 h-10 rounded-xl bg-apple-blue-light/15 flex items-center justify-center text-apple-blue-light">
                <HiBriefcase className="w-5 h-5" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1]">
                Recruitment Drives.<br />Perfectly coordinated.
              </h2>
              <p className="text-white/70 text-base leading-[1.47] tracking-tight">
                Define criteria, describe roles, and post package metrics. The live countdown system notifies students of registration deadlines so they never miss an opportunity to apply.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-sm text-white/90">
                  <HiCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Real-time status tracking (Active / Completed)</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/90">
                  <HiCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Automatic countdown of days remaining to apply</span>
                </li>
              </ul>
            </div>
            <div className="lg:order-1 glass-card p-6 bg-[#1d1d1f] border border-white/10 rounded-apple-lg shadow-md aspect-video flex flex-col justify-between">
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <h4 className="font-bold text-white text-lg">Google recruitment</h4>
                  <p className="text-xs text-white/50 mt-0.5">Software Engineer · Bangalore</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active</span>
              </div>
              <div className="my-4">
                <p className="text-sm text-white/80">Eligibility: CGPA &ge; 8.0, No active backlogs.</p>
                <p className="text-2xl font-bold text-apple-blue-light mt-2">₹32.5 LPA</p>
              </div>
              <div className="flex justify-between items-center text-xs text-white/50 border-t border-white/5 pt-3">
                <span>Deadline: June 15, 2026</span>
                <span className="text-emerald-400 font-semibold">12 days left</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tile 3: Parchment canvas - Students & Higher Studies */}
        <div className="bg-[#f5f5f7] py-24 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-10 h-10 rounded-xl bg-apple-blue/10 flex items-center justify-center text-apple-blue">
                <HiUserGroup className="w-5 h-5" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1] text-apple-ink">
                Students & Higher Studies.<br />Mapped accurately.
              </h2>
              <p className="text-apple-ink-48 text-base leading-[1.47] tracking-tight">
                Maintain comprehensive student lists, complete with academic records (CGPA, branch, batch). Track those opting for higher academic degrees globally, from program types to admission universities.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-sm text-apple-ink-80">
                  <HiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Advanced filtering by branch, batch, and status</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-apple-ink-80">
                  <HiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Comprehensive global university records</span>
                </li>
              </ul>
            </div>
            <div className="glass-card bg-white border border-apple-hairline rounded-apple-lg shadow-sm overflow-hidden text-xs">
              <div className="bg-apple-parchment p-3 border-b border-apple-hairline font-semibold text-apple-ink-48 flex justify-between">
                <span>Student</span>
                <span>University</span>
                <span>Program</span>
              </div>
              <div className="p-3 divide-y divide-apple-divider">
                <div className="py-2 flex justify-between text-apple-ink">
                  <span>Aarav Mehta</span>
                  <span className="text-apple-ink-80">Stanford University</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-apple-blue font-semibold">M.S.</span>
                </div>
                <div className="py-2 flex justify-between text-apple-ink">
                  <span>Ananya Sharma</span>
                  <span className="text-apple-ink-80">MIT</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-apple-blue font-semibold">Ph.D.</span>
                </div>
                <div className="py-2 flex justify-between text-apple-ink">
                  <span>Kabir Sen</span>
                  <span className="text-apple-ink-80">University of Toronto</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-apple-blue font-semibold">M.S.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Store-style features grid */}
      <section id="security" className="bg-white py-24 px-6 border-t border-apple-hairline">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="w-12 h-12 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue mx-auto mb-4">
              <HiShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-apple-ink">
              Secure administration. Built in.
            </h2>
            <p className="text-apple-ink-48 text-base mt-3 leading-[1.47]">
              Engineered to offer complete privacy controls, user validation workflows, and seamless record updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="store-utility-card bg-white border border-apple-hairline rounded-apple-lg p-6 hover:border-apple-blue/30 transition-all duration-300">
              <h4 className="font-semibold text-apple-ink text-lg mb-2">Gatekept Signups</h4>
              <p className="text-apple-ink-48 text-sm leading-relaxed">
                All student registrations go directly to a pending review list. Access is granted only when an approved Administrator approves their signup.
              </p>
            </div>
            {/* Card 2 */}
            <div className="store-utility-card bg-white border border-apple-hairline rounded-apple-lg p-6 hover:border-apple-blue/30 transition-all duration-300">
              <h4 className="font-semibold text-apple-ink text-lg mb-2">Password Overwrites</h4>
              <p className="text-apple-ink-48 text-sm leading-relaxed">
                Admins hold the right to securely reset password hashes of registered student accounts, complete with a built-in random password generator tool.
              </p>
            </div>
            {/* Card 3 */}
            <div className="store-utility-card bg-white border border-apple-hairline rounded-apple-lg p-6 hover:border-apple-blue/30 transition-all duration-300">
              <h4 className="font-semibold text-apple-ink text-lg mb-2">Unified Records</h4>
              <p className="text-apple-ink-48 text-sm leading-relaxed">
                Add, modify, and delete operations are safely guarded. Database relationships automatically sync student statuses (e.g. updating a student to "placed" on offer save).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f5f5f7] py-24 px-6 text-center border-t border-apple-hairline">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-apple-ink">
            Ready to streamline placement tracking?
          </h2>
          <p className="text-apple-ink-48 text-base max-w-lg mx-auto leading-[1.47]">
            Deploy CareerAtlas in your institution today. Simple setup, zero configurations.
          </p>
          <div className="pt-4">
            {user ? (
              <Link to="/dashboard" className="btn-primary py-3 px-8 text-base font-semibold">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn-primary py-3 px-8 text-base font-semibold">
                Enter Placement Portal
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer (Apple styling from DESIGN.md) */}
      <footer className="bg-[#f5f5f7] border-t border-apple-hairline py-16 px-6 text-xs text-apple-ink-48">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8 mb-12">
          <div>
            <h5 className="font-semibold text-apple-ink mb-4">Portal Pages</h5>
            <ul className="space-y-3">
              <li><Link to="/login" className="hover:text-apple-ink transition-colors">Sign In</Link></li>
              <li><Link to="/students" className="hover:text-apple-ink transition-colors">Student Records</Link></li>
              <li><Link to="/placements" className="hover:text-apple-ink transition-colors">Placements List</Link></li>
              <li><Link to="/higher-studies" className="hover:text-apple-ink transition-colors">Higher Education</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-apple-ink mb-4">Recruitment</h5>
            <ul className="space-y-3">
              <li><Link to="/drives" className="hover:text-apple-ink transition-colors">Upcoming Drives</Link></li>
              <li><Link to="/drives" className="hover:text-apple-ink transition-colors">Job Descriptions</Link></li>
              <li><Link to="/drives" className="hover:text-apple-ink transition-colors">Eligibility Checker</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-apple-ink mb-4">Institution</h5>
            <ul className="space-y-3">
              <li><a href="#features" className="hover:text-apple-ink transition-colors">Overview</a></li>
              <li><a href="#security" className="hover:text-apple-ink transition-colors">Data Security</a></li>
              <li><a href="#security" className="hover:text-apple-ink transition-colors">User Approvals</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-apple-ink mb-4">System</h5>
            <p className="leading-relaxed">
              CareerAtlas v1.1.0-alpha<br />
              Powered by SF Pro & Inter font systems.<br />
              Designed in compliance with academic database norms.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto border-t border-apple-hairline pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-apple-ink-48">
          <p>&copy; {new Date().getFullYear()} CareerAtlas Inc. All rights reserved. Created by Dev Sheta.</p>
          <div className="flex gap-6">
            <span className="hover:text-apple-ink cursor-default transition-colors">Privacy Policy</span>
            <span className="hover:text-apple-ink cursor-default transition-colors">Terms of Use</span>
            <span className="hover:text-apple-ink cursor-default transition-colors">Site Map</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
