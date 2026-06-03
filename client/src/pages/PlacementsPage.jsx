/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import { BRANCHES, BATCHES, PLACEMENT_TYPES } from '../utils/constants';
import { formatPackage, formatDate } from '../utils/helpers';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { HiPlus, HiPencil, HiTrash, HiMagnifyingGlass } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const initialForm = {
  studentId: '',
  company: '',
  role: '',
  package: '',
  placementType: '',
  placementDate: '',
  location: '',
};

export default function PlacementsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    branch: '',
    batch: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [studentsList, setStudentsList] = useState([]);

  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const fetchPlacements = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filters.search) params.search = filters.search;
      if (filters.branch) params.branch = filters.branch;
      if (filters.batch) params.batch = filters.batch;

      const res = await api.getPlacements(params);
      const data = res.data?.data || res.data || res;
      setPlacements(data.placements || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load placements');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchPlacements();
  }, [fetchPlacements]);

  const loadStudents = async () => {
    try {
      const res = await api.getStudents({ limit: 1000 });
      const data = res.data?.data || res.data || res;
      setStudentsList(data.students || []);
    } catch {
      console.error('Failed to load students list');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const openAddModal = () => {
    setEditingPlacement(null);
    setForm(initialForm);
    loadStudents();
    setModalOpen(true);
  };

  const openEditModal = (placement) => {
    setEditingPlacement(placement);
    setForm({
      studentId: placement.studentId?._id || placement.studentId || '',
      company: placement.company || '',
      role: placement.role || '',
      package: placement.package || '',
      placementType: placement.placementType || '',
      placementDate: placement.placementDate
        ? new Date(placement.placementDate).toISOString().split('T')[0]
        : '',
      location: placement.location || '',
    });
    loadStudents();
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.company || !form.role || !form.package) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, package: Number(form.package) };
      if (editingPlacement) {
        await api.updatePlacement(editingPlacement._id, payload);
        toast.success('Placement updated successfully');
      } else {
        await api.createPlacement(payload);
        toast.success('Placement added successfully');
      }
      setModalOpen(false);
      fetchPlacements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save placement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deletePlacement(deleteConfirm.id);
      toast.success('Placement deleted successfully');
      setDeleteConfirm({ open: false, id: null });
      fetchPlacements();
    } catch {
      toast.error('Failed to delete placement');
    }
  };

  const getPackageColor = (pkg) => {
    if (pkg >= 20) return 'text-emerald-600';
    if (pkg >= 10) return 'text-apple-blue';
    return 'text-apple-ink-80';
  };

  const columns = [
    {
      header: 'Student',
      accessor: (row) => (
        <span className="text-apple-ink font-medium">
          {row.studentId?.name || '—'}
        </span>
      ),
    },
    {
      header: 'Company',
      accessor: (row) => (
        <span className="text-apple-ink-80 font-medium">{row.company}</span>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
    },
    {
      header: 'Package',
      accessor: (row) => (
        <span className={`font-bold ${getPackageColor(row.package)}`}>
          {formatPackage(row.package)}
        </span>
      ),
    },
    {
      header: 'Type',
      accessor: (row) => {
        const typeColors = {
          'On-Campus': 'badge-info',
          'Off-Campus': 'badge-warning',
          'Pool Campus': 'badge-purple',
        };
        return (
          <span className={`badge ${typeColors[row.placementType] || 'badge-neutral'}`}>
            {row.placementType || '—'}
          </span>
        );
      },
    },
    {
      header: 'Date',
      accessor: (row) => (
        <span className="text-apple-ink-48 text-sm">{formatDate(row.placementDate)}</span>
      ),
    },
    ...(isAdmin
      ? [
          {
            header: 'Actions',
            accessor: (row) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(row)}
                  className="p-2 text-apple-ink-48 hover:text-apple-blue hover:bg-apple-parchment rounded-lg transition-all duration-200"
                  title="Edit"
                >
                  <HiPencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ open: true, id: row._id })}
                  className="p-2 text-apple-ink-48 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Delete"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-apple-ink">Placements</h1>
          <p className="text-apple-ink-48 text-sm mt-1">Track and manage student placement records</p>
        </div>
        {isAdmin && (
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
            <HiPlus className="w-5 h-5" />
            Add Placement
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-ink-48" />
            <input
              type="text"
              placeholder="Search by student name or company..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
          <select
            value={filters.branch}
            onChange={(e) => handleFilterChange('branch', e.target.value)}
            className="select-field min-w-[150px]"
          >
            <option value="">All Branches</option>
            {BRANCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select
            value={filters.batch}
            onChange={(e) => handleFilterChange('batch', e.target.value)}
            className="select-field min-w-[130px]"
          >
            <option value="">All Batches</option>
            {BATCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card overflow-hidden">
        <DataTable
          columns={columns}
          data={placements}
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPlacement ? 'Edit Placement' : 'Add Placement'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">
                Student <span className="text-red-400">*</span>
              </label>
              <select
                name="studentId"
                value={form.studentId}
                onChange={handleFormChange}
                className="select-field w-full"
                required
              >
                <option value="">Select Student</option>
                {studentsList.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.enrollmentNo})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                name="company"
                value={form.company}
                onChange={handleFormChange}
                className="input-field w-full"
                placeholder="Google"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">
                Role <span className="text-red-400">*</span>
              </label>
              <input
                name="role"
                value={form.role}
                onChange={handleFormChange}
                className="input-field w-full"
                placeholder="Software Engineer"
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
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">Placement Type</label>
              <select
                name="placementType"
                value={form.placementType}
                onChange={handleFormChange}
                className="select-field w-full"
              >
                <option value="">Select Type</option>
                {PLACEMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">Date</label>
              <input
                name="placementDate"
                type="date"
                value={form.placementDate}
                onChange={handleFormChange}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleFormChange}
                className="input-field w-full"
                placeholder="Bangalore"
              />
            </div>
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
              ) : editingPlacement ? (
                'Update Placement'
              ) : (
                'Add Placement'
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
        title="Delete Placement"
        message="Are you sure you want to delete this placement record? This action cannot be undone."
      />
    </div>
  );
}
