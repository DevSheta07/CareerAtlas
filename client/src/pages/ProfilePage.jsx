import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import { BRANCHES, BATCHES } from '../utils/constants';
import { getStatusLabel, getStatusColor } from '../utils/helpers';
import toast from 'react-hot-toast';
import { HiUser, HiAcademicCap, HiBriefcase } from 'react-icons/hi2';

export default function ProfilePage() {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    enrollmentNo: '',
    branch: '',
    batch: '',
    cgpa: '',
    status: 'unplaced',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.getMyProfile();
        const student = res.data?.data || res.data || res;
        if (student) {
          setForm({
            name: student.name || '',
            email: student.email || '',
            phone: student.phone || '',
            enrollmentNo: student.enrollmentNo || '',
            branch: student.branch || '',
            batch: student.batch || '',
            cgpa: student.cgpa !== undefined ? student.cgpa : '',
            status: student.status || 'unplaced',
          });
        }
      } catch (err) {
        toast.error('Failed to load profile details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.enrollmentNo || !form.branch || !form.batch) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        cgpa: form.cgpa === '' ? undefined : Number(form.cgpa),
      };
      await api.updateMyProfile(payload);
      await refreshUser(); // Update global auth context details (e.g. name, email)
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-apple-hairline" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-apple-blue animate-spin" />
        </div>
        <p className="mt-4 text-sm text-apple-ink-48">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-apple-ink tracking-tight" style={{ letterSpacing: '-0.28px' }}>
          My Profile
        </h1>
        <p className="text-apple-ink-48 text-sm">
          Keep your contact details, enrollment info, and academic performance up to date.
        </p>
      </div>

      {/* Main Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-apple-hairline rounded-apple-lg p-6 sm:p-8 space-y-8">
        
        {/* Personal Details Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-apple-divider pb-3">
            <HiUser className="w-5 h-5 text-apple-blue" />
            <h2 className="text-lg font-semibold text-apple-ink">Personal Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-apple-ink mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-apple-ink mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-apple-ink mb-1.5">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="9876543210"
              />
            </div>
          </div>
        </div>

        {/* Academic Details Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-apple-divider pb-3">
            <HiAcademicCap className="w-5 h-5 text-apple-blue" />
            <h2 className="text-lg font-semibold text-apple-ink">Academic Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="enrollmentNo" className="block text-sm font-semibold text-apple-ink mb-1.5">
                Enrollment Number <span className="text-red-500">*</span>
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
            <div>
              <label htmlFor="branch" className="block text-sm font-semibold text-apple-ink mb-1.5">
                Branch <span className="text-red-500">*</span>
              </label>
              <select
                id="branch"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="select-field w-full"
                required
              >
                <option value="">Select Branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="batch" className="block text-sm font-semibold text-apple-ink mb-1.5">
                Batch <span className="text-red-500">*</span>
              </label>
              <select
                id="batch"
                name="batch"
                value={form.batch}
                onChange={handleChange}
                className="select-field w-full"
                required
              >
                <option value="">Select Batch</option>
                {BATCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cgpa" className="block text-sm font-semibold text-apple-ink mb-1.5">
                CGPA (out of 10.0)
              </label>
              <input
                id="cgpa"
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={form.cgpa}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="8.5"
              />
            </div>
          </div>
        </div>

        {/* Career / Placement Status Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-apple-divider pb-3">
            <HiBriefcase className="w-5 h-5 text-apple-blue" />
            <h2 className="text-lg font-semibold text-apple-ink">Career Status</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-apple-ink mb-1.5">
                Status
              </label>
              <div className="flex items-center mt-2.5">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(form.status)}`}>
                  {getStatusLabel(form.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end pt-4 border-t border-apple-divider">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
