/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import { BRANCHES, BATCHES, STUDENT_STATUSES } from '../utils/constants';
import { getStatusColor, getStatusLabel } from '../utils/helpers';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { HiPlus, HiPencil, HiTrash, HiMagnifyingGlass } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const initialForm = {
  name: '',
  enrollmentNo: '',
  branch: '',
  batch: '',
  cgpa: '',
  email: '',
  phone: '',
  status: 'unplaced',
};

export default function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    branch: '',
    batch: '',
    status: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const fetchStudents = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filters.search) params.search = filters.search;
      if (filters.branch) params.branch = filters.branch;
      if (filters.batch) params.batch = filters.batch;
      if (filters.status) params.status = filters.status;

      const res = await api.getStudents(params);
      const data = res.data?.data || res.data || res;
      setStudents(data.students || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setForm({
      name: student.name || '',
      enrollmentNo: student.enrollmentNo || '',
      branch: student.branch || '',
      batch: student.batch || '',
      cgpa: student.cgpa || '',
      email: student.email || '',
      phone: student.phone || '',
      status: student.status || 'unplaced',
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.enrollmentNo || !form.branch || !form.batch) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, cgpa: form.cgpa ? Number(form.cgpa) : undefined };
      if (editingStudent) {
        await api.updateStudent(editingStudent._id, payload);
        toast.success('Student updated successfully');
      } else {
        await api.createStudent(payload);
        toast.success('Student added successfully');
      }
      setModalOpen(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save student');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteStudent(deleteConfirm.id);
      toast.success('Student deleted successfully');
      setDeleteConfirm({ open: false, id: null });
      fetchStudents();
    } catch {
      toast.error('Failed to delete student');
    }
  };

  const columns = [
    {
      header: 'Name',
      accessor: (row) => (
        <span className="text-apple-ink font-medium">{row.name}</span>
      ),
    },
    {
      header: 'Enrollment No',
      accessor: 'enrollmentNo',
    },
    {
      header: 'Branch',
      accessor: (row) => (
        <span className="badge badge-info">{row.branch}</span>
      ),
    },
    {
      header: 'Batch',
      accessor: 'batch',
    },
    {
      header: 'CGPA',
      accessor: (row) => (
        <span className={`font-semibold ${row.cgpa >= 8 ? 'text-emerald-600' : row.cgpa >= 6 ? 'text-amber-600' : 'text-apple-ink-80'}`}>
          {row.cgpa ? row.cgpa.toFixed(2) : '—'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span className={`badge ${getStatusColor(row.status)}`}>
          {getStatusLabel(row.status)}
        </span>
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
          <h1 className="text-2xl font-bold text-apple-ink">Students</h1>
          <p className="text-apple-ink-48 text-sm mt-1">Manage student records and information</p>
        </div>
        {isAdmin && (
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
            <HiPlus className="w-5 h-5" />
            Add Student
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
              placeholder="Search by name or enrollment..."
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
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="select-field min-w-[140px]"
          >
            <option value="">All Statuses</option>
            {STUDENT_STATUSES.map((s) => (
              <option key={s} value={s}>{getStatusLabel(s)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card overflow-hidden">
        <DataTable
          columns={columns}
          data={students}
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
          title={editingStudent ? 'Edit Student' : 'Add Student'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className="input-field w-full"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">
                Enrollment No <span className="text-red-500">*</span>
              </label>
              <input
                name="enrollmentNo"
                value={form.enrollmentNo}
                onChange={handleFormChange}
                className="input-field w-full"
                placeholder="EN2024001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">
                Branch <span className="text-red-500">*</span>
              </label>
              <select
                name="branch"
                value={form.branch}
                onChange={handleFormChange}
                className="select-field w-full"
                required
              >
                <option value="">Select Branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">
                Batch <span className="text-red-500">*</span>
              </label>
              <select
                name="batch"
                value={form.batch}
                onChange={handleFormChange}
                className="select-field w-full"
                required
              >
                <option value="">Select Batch</option>
                {BATCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">CGPA</label>
              <input
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={form.cgpa}
                onChange={handleFormChange}
                className="input-field w-full"
                placeholder="8.50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                className="input-field w-full"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">Phone</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleFormChange}
                className="input-field w-full"
                placeholder="+91 9876543210"
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
                {STUDENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{getStatusLabel(s)}</option>
                ))}
              </select>
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
              ) : editingStudent ? (
                'Update Student'
              ) : (
                'Add Student'
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
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
      />
    </div>
  );
}
