/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { formatDate } from '../utils/helpers';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  HiCheck,
  HiXMark,
  HiUserGroup,
  HiEnvelope,
  HiCalendarDays,
  HiKey,
  HiTrash,
  HiMagnifyingGlass,
  HiLockClosed,
  HiEye,
  HiEyeSlash
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'registered'
  const [pendingUsers, setPendingUsers] = useState([]);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  
  // Dialog & Modal states
  const [rejectConfirm, setRejectConfirm] = useState({ open: false, id: null, name: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: '', email: '' });
  const [resetModal, setResetModal] = useState({ open: false, id: null, name: '', email: '' });
  
  // Password reset fields
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPendingUsers = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const res = await api.getPendingUsers();
      const data = res.data || res;
      setPendingUsers(data.data || []);
    } catch {
      toast.error('Failed to load pending users');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRegisteredStudents = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const res = await api.getApprovedStudents();
      const data = res.data?.data || res.data || res;
      setRegisteredStudents(data);
    } catch {
      toast.error('Failed to load registered students');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch based on active tab
  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingUsers();
    } else {
      fetchRegisteredStudents();
    }
  }, [activeTab, fetchPendingUsers, fetchRegisteredStudents]);

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await api.approveUser(id);
      toast.success('Account approved successfully');
      fetchPendingUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve account');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async () => {
    const { id } = rejectConfirm;
    setActioningId(id);
    setRejectConfirm({ open: false, id: null, name: '' });
    try {
      await api.rejectUser(id);
      toast.success('Account request rejected and deleted');
      fetchPendingUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject account request');
    } finally {
      setActioningId(null);
    }
  };

  const handleDeleteUser = async () => {
    const { id } = deleteConfirm;
    setActioningId(id);
    setDeleteConfirm({ open: false, id: null, name: '', email: '' });
    try {
      await api.deleteUser(id);
      toast.success('Student account deleted successfully');
      fetchRegisteredStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete student account');
    } finally {
      setActioningId(null);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const { id } = resetModal;
    setResettingPassword(true);
    try {
      await api.adminResetPassword(id, newPassword);
      toast.success('Password updated successfully');
      setResetModal({ open: false, id: null, name: '', email: '' });
      setNewPassword('');
      setShowPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setResettingPassword(false);
    }
  };

  // Filter students based on search
  const filteredStudents = registeredStudents.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-apple-ink">User Management</h1>
          <p className="text-apple-ink-48 text-sm mt-1">
            Approve pending signups and manage registered student accounts
          </p>
        </div>

        {/* Premium Tab Selector */}
        <div className="flex bg-apple-parchment p-1 rounded-xl w-fit border border-apple-hairline">
          <button
            onClick={() => {
              setActiveTab('pending');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'pending'
                ? 'bg-apple-blue text-white shadow-sm'
                : 'text-apple-ink-48 hover:text-apple-ink hover:bg-apple-parchment'
            }`}
          >
            Pending Approvals
          </button>
          <button
            onClick={() => {
              setActiveTab('registered');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'registered'
                ? 'bg-apple-blue text-white shadow-sm'
                : 'text-apple-ink-48 hover:text-apple-ink hover:bg-apple-parchment'
            }`}
          >
            Registered Students
          </button>
        </div>
      </div>

      {/* Search Bar (Registered Tab only) */}
      {activeTab === 'registered' && (
        <div className="relative max-w-md w-full animate-fade-in">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <HiMagnifyingGlass className="h-5 w-5 text-apple-ink-48" />
          </div>
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11"
          />
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-apple-divider rounded w-1/4" />
                <div className="h-4 bg-apple-divider rounded w-1/3" />
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-apple-divider rounded-xl" />
                <div className="h-10 w-24 bg-apple-divider rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'pending' ? (
        // PENDING APPROVALS TAB
        pendingUsers.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <HiUserGroup className="w-16 h-16 text-apple-ink-48 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-apple-ink-48 mb-2">No Pending Approvals</h3>
            <p className="text-apple-ink-48">
              All user registration requests have been processed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 animate-fade-in">
            {pendingUsers.map((pUser) => (
              <div
                key={pUser._id}
                className="glass-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-apple-blue/30 transition-all duration-300"
              >
                {/* User Profile Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-apple-blue to-apple-blue-focus rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
                    {pUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-apple-ink leading-tight">{pUser.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-apple-ink-48">
                      <span className="flex items-center gap-1.5">
                        <HiEnvelope className="w-4 h-4 text-apple-ink-48" />
                        {pUser.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <HiCalendarDays className="w-4 h-4 text-apple-ink-48" />
                        Joined {formatDate(pUser.createdAt)}
                      </span>
                    </div>
                    <div className="pt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-apple-blue/10 text-apple-blue border border-apple-blue/20">
                        {pUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    disabled={actioningId !== null}
                    onClick={() => setRejectConfirm({ open: true, id: pUser._id, name: pUser.name })}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-red-300 bg-transparent text-red-600 hover:bg-red-50 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <HiXMark className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    disabled={actioningId !== null}
                    onClick={() => handleApprove(pUser._id)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <HiCheck className="w-4 h-4" />
                    {actioningId === pUser._id ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // REGISTERED STUDENTS TAB
        filteredStudents.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <HiUserGroup className="w-16 h-16 text-apple-ink-48 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-apple-ink-48 mb-2">No Registered Students</h3>
            <p className="text-apple-ink-48">
              {searchQuery ? 'No students match your search criteria.' : 'There are no registered students in the system.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 animate-fade-in">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="glass-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-apple-blue/30 transition-all duration-300"
              >
                {/* Student Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-apple-blue to-apple-blue-focus rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
                    {student.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-apple-ink leading-tight">{student.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-apple-ink-48">
                      <span className="flex items-center gap-1.5">
                        <HiEnvelope className="w-4 h-4 text-apple-ink-48" />
                        {student.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <HiCalendarDays className="w-4 h-4 text-apple-ink-48" />
                        Registered {formatDate(student.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    disabled={actioningId !== null}
                    onClick={() =>
                      setResetModal({
                        open: true,
                        id: student._id,
                        name: student.name,
                        email: student.email,
                      })
                    }
                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-apple-blue bg-transparent text-apple-blue hover:bg-apple-blue/[0.08] active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    title="Reset Password"
                  >
                    <HiKey className="w-4 h-4" />
                    Reset Password
                  </button>
                  <button
                    disabled={actioningId !== null}
                    onClick={() =>
                      setDeleteConfirm({
                        open: true,
                        id: student._id,
                        name: student.name,
                        email: student.email,
                      })
                    }
                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-red-300 bg-transparent text-red-600 hover:bg-red-50 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    title="Delete Student"
                  >
                    <HiTrash className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={rejectConfirm.open}
        onClose={() => setRejectConfirm({ open: false, id: null, name: '' })}
        onConfirm={handleReject}
        title="Reject Signup Request"
        message={`Are you sure you want to reject and delete the signup request from ${rejectConfirm.name}?`}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null, name: '', email: '' })}
        onConfirm={handleDeleteUser}
        title="Delete Student Account"
        message={`Are you sure you want to delete ${deleteConfirm.name}'s account (${deleteConfirm.email})? This will revoke all portal access and cannot be undone.`}
      />

      {/* Reset Password Modal */}
      {resetModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setResetModal({ open: false, id: null, name: '', email: '' });
              setNewPassword('');
              setShowPassword(false);
            }}
          />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-md glass-card p-6 animate-slide-up bg-white border border-apple-hairline rounded-apple-lg shadow-md">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-apple-blue/10 border border-apple-blue/20 text-apple-blue">
                <HiLockClosed className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-apple-ink">Reset Password</h3>
                <p className="text-xs text-apple-ink-48">
                  Update credentials for {resetModal.name}
                </p>
              </div>
            </div>

            {/* Email info */}
            <div className="bg-apple-parchment border border-apple-hairline rounded-xl p-3.5 mb-5 flex items-center gap-2">
              <HiEnvelope className="w-4 h-4 text-apple-ink-48 flex-shrink-0" />
              <span className="text-sm text-apple-ink-80 truncate">{resetModal.email}</span>
            </div>

            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-apple-ink-80 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field pr-12 text-sm"
                    placeholder="Enter new password (min. 6 chars)"
                    required
                    minLength={6}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-apple-ink-48 hover:text-apple-ink p-1 rounded transition-colors"
                  >
                    {showPassword ? (
                      <HiEyeSlash className="w-5 h-5" />
                    ) : (
                      <HiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Generator link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
                    let pass = '';
                    for (let i = 0; i < 10; i++) {
                      pass += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    setNewPassword(pass);
                    setShowPassword(true);
                    toast.success('Random password generated');
                  }}
                  className="text-xs font-medium text-apple-blue hover:text-apple-blue-focus transition-colors"
                >
                  Generate secure password
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-apple-divider">
                <button
                  type="button"
                  onClick={() => {
                    setResetModal({ open: false, id: null, name: '', email: '' });
                    setNewPassword('');
                    setShowPassword(false);
                  }}
                  className="btn-secondary flex-1 text-center justify-center text-sm"
                  disabled={resettingPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 text-center justify-center text-sm"
                  disabled={resettingPassword}
                >
                  {resettingPassword ? 'Updating...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
