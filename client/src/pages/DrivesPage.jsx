/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import { DRIVE_STATUSES } from '../utils/constants';
import { formatPackage, formatDate, getStatusColor, daysUntil } from '../utils/helpers';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiBuildingOffice2,
  HiCalendarDays,
  HiClock,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

const STATUS_TABS = ['All', 'Active', 'Completed', 'Cancelled'];

const initialForm = {
  company: '',
  package: '',
  eligibility: '',
  deadline: '',
  description: '',
  status: 'active',
};

const getBorderColor = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'active') return 'border-t-emerald-500';
  if (s === 'completed') return 'border-t-apple-blue';
  if (s === 'cancelled') return 'border-t-red-500';
  return 'border-t-apple-hairline';
};

const getCountdownColor = (days) => {
  if (days > 7) return 'text-emerald-600';
  if (days >= 3) return 'text-amber-600';
  return 'text-red-600';
};

function DescriptionText({ text, limit = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;
  if (text.length <= limit) {
    return <p className="text-sm text-apple-ink-48 mb-4 whitespace-pre-line">{text}</p>;
  }

  return (
    <p className="text-sm text-apple-ink-48 mb-4 whitespace-pre-line">
      {isExpanded ? text : `${text.slice(0, limit)}...`}{' '}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="text-apple-blue hover:text-apple-blue-focus font-semibold ml-1 focus:outline-none inline-block text-xs"
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </p>
  );
}

function EligibilityText({ text, limit = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;
  if (text.length <= limit) {
    return <p className="text-sm text-apple-ink-80 mb-3 whitespace-pre-line">{text}</p>;
  }

  return (
    <p className="text-sm text-apple-ink-80 mb-3 whitespace-pre-line">
      {isExpanded ? text : `${text.slice(0, limit)}...`}{' '}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="text-apple-blue hover:text-apple-blue-focus font-semibold ml-1 focus:outline-none inline-block text-xs"
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </p>
  );
}

export default function DrivesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const fetchDrives = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'All') params.status = activeTab.toLowerCase();

      const res = await api.getDrives(params);
      const data = res.data?.data || res.data || res;
      setDrives(data.drives || []);
    } catch {
      toast.error('Failed to load drives');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  const openAddModal = () => {
    setEditingDrive(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (drive) => {
    setEditingDrive(drive);
    setForm({
      company: drive.company || '',
      package: drive.package || '',
      eligibility: drive.eligibility || '',
      deadline: drive.deadline
        ? new Date(drive.deadline).toISOString().split('T')[0]
        : '',
      description: drive.description || '',
      status: drive.status || 'Active',
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.company || !form.package) {
      toast.error('Please fill in required fields');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, package: Number(form.package) };
      if (editingDrive) {
        await api.updateDrive(editingDrive._id, payload);
        toast.success('Drive updated successfully');
      } else {
        await api.createDrive(payload);
        toast.success('Drive created successfully');
      }
      setModalOpen(false);
      fetchDrives();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save drive');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteDrive(deleteConfirm.id);
      toast.success('Drive deleted successfully');
      setDeleteConfirm({ open: false, id: null });
      fetchDrives();
    } catch {
      toast.error('Failed to delete drive');
    }
  };

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-apple-ink">Placement Drives</h1>
          <p className="text-apple-ink-48 text-sm mt-1">Manage upcoming and past placement drives</p>
        </div>
        {isAdmin && (
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
            <HiPlus className="w-5 h-5" />
            Add Drive
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab
                ? 'bg-apple-blue text-white shadow-sm'
                : 'glass-card-solid text-apple-ink-80 hover:text-apple-ink hover:bg-apple-parchment'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Drive Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 border-t-4 border-t-apple-hairline animate-pulse">
              <div className="h-6 bg-apple-divider rounded w-3/4 mb-3" />
              <div className="h-5 bg-apple-divider rounded w-1/3 mb-4" />
              <div className="h-4 bg-apple-divider rounded w-full mb-2" />
              <div className="h-4 bg-apple-divider rounded w-2/3 mb-4" />
              <div className="flex justify-between">
                <div className="h-6 bg-apple-divider rounded w-20" />
                <div className="h-6 bg-apple-divider rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : drives.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <HiBuildingOffice2 className="w-16 h-16 text-apple-ink-48 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-apple-ink-48 mb-2">No Drives Found</h3>
          <p className="text-apple-ink-48">
            {activeTab !== 'All'
              ? `No ${activeTab.toLowerCase()} drives at the moment`
              : 'No placement drives have been created yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drives.map((drive) => {
            const days = drive.deadline ? daysUntil(drive.deadline) : null;
            const isActive = (drive.status || '').toLowerCase() === 'active';

            return (
              <div
                key={drive._id}
                className={`glass-card p-6 border-t-4 ${getBorderColor(drive.status)} hover:border-apple-blue/30 transition-all duration-300 group relative`}
              >
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => openEditModal(drive)}
                      className="p-1.5 text-apple-ink-48 hover:text-apple-blue hover:bg-apple-parchment rounded-lg transition-all"
                    >
                      <HiPencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ open: true, id: drive._id })}
                      className="p-1.5 text-apple-ink-48 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Company Name */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-apple-parchment rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiBuildingOffice2 className="w-5 h-5 text-apple-blue" />
                  </div>
                  <div className="pr-12">
                    <h3 className="text-xl font-bold text-apple-ink leading-tight">{drive.company}</h3>
                  </div>
                </div>

                {/* Package */}
                <p className="text-lg font-semibold text-apple-blue mb-3">
                  {formatPackage(drive.package)}
                </p>

                {/* Eligibility */}
                <EligibilityText text={drive.eligibility} />

                {/* Description */}
                <DescriptionText text={drive.description} />

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-apple-divider">
                  {/* Deadline + Countdown */}
                  <div className="flex items-center gap-2">
                    {drive.deadline && (
                      <>
                        <HiCalendarDays className="w-4 h-4 text-apple-ink-48" />
                        <span className="text-xs text-apple-ink-48">{formatDate(drive.deadline)}</span>
                        {days !== null && days >= 0 && (
                          <span className={`text-xs font-semibold flex items-center gap-1 ${getCountdownColor(days)}`}>
                            <HiClock className="w-3.5 h-3.5" />
                            {days === 0 ? 'Today' : `${days}d left`}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                    )}
                    <span className={`badge ${getStatusColor(drive.status)}`}>
                      {drive.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDrive ? 'Edit Drive' : 'Add Placement Drive'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                name="company"
                value={form.company}
                onChange={handleFormChange}
                className="input-field w-full"
                placeholder="Company Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">
                Package (LPA) <span className="text-red-400">*</span>
              </label>
              <input
                name="package"
                type="number"
                step="0.01"
                min="0"
                value={form.package}
                onChange={handleFormChange}
                className="input-field w-full"
                placeholder="12.5"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">Eligibility Criteria</label>
            <textarea
              name="eligibility"
              value={form.eligibility}
              onChange={handleFormChange}
              className="input-field w-full min-h-[80px] resize-y"
              placeholder="CGPA >= 7.0, No active backlogs..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">Deadline</label>
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleFormChange}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="select-field w-full"
              >
                {DRIVE_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              className="input-field w-full min-h-[80px] resize-y"
              placeholder="Additional details about the drive..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-apple-divider">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : editingDrive ? (
                'Update Drive'
              ) : (
                'Create Drive'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Drive"
        message="Are you sure you want to delete this placement drive? This action cannot be undone."
      />
    </div>
  );
}
