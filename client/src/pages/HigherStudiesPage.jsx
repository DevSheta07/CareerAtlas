/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import { COUNTRIES, PROGRAMS } from '../utils/constants';
import { getProgramColor } from '../utils/helpers';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiMagnifyingGlass,
  HiTableCells,
  HiSquares2X2,
  HiAcademicCap,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

const initialForm = {
  studentId: '',
  university: '',
  country: '',
  program: '',
  admissionYear: new Date().getFullYear(),
};

export default function HigherStudiesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    program: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [studentsList, setStudentsList] = useState([]);

  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const fetchRecords = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filters.search) params.search = filters.search;
      if (filters.country) params.country = filters.country;
      if (filters.program) params.program = filters.program;

      const res = await api.getHigherStudies(params);
      const data = res.data?.data || res.data || res;
      setRecords(data.higherStudies || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load higher studies records');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

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
    setEditingRecord(null);
    setForm(initialForm);
    loadStudents();
    setModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setForm({
      studentId: record.studentId?._id || record.studentId || '',
      university: record.university || '',
      country: record.country || '',
      program: record.program || '',
      admissionYear: record.admissionYear || new Date().getFullYear(),
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
    if (!form.studentId || !form.university || !form.country || !form.program) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, admissionYear: Number(form.admissionYear) };
      if (editingRecord) {
        await api.updateHigherStudy(editingRecord._id, payload);
        toast.success('Record updated successfully');
      } else {
        await api.createHigherStudy(payload);
        toast.success('Record added successfully');
      }
      setModalOpen(false);
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteHigherStudy(deleteConfirm.id);
      toast.success('Record deleted successfully');
      setDeleteConfirm({ open: false, id: null });
      fetchRecords();
    } catch {
      toast.error('Failed to delete record');
    }
  };

  const columns = [
    {
      header: 'Student Name',
      accessor: (row) => (
        <span className="text-apple-ink font-medium">{row.studentId?.name || '—'}</span>
      ),
    },
    {
      header: 'University',
      accessor: (row) => (
        <span className="text-apple-ink-80">{row.university}</span>
      ),
    },
    {
      header: 'Country',
      accessor: (row) => (
        <span className="text-apple-ink-80">
          {row.country}
        </span>
      ),
    },
    {
      header: 'Program',
      accessor: (row) => (
        <span className={`badge ${getProgramColor(row.program)}`}>
          {row.program}
        </span>
      ),
    },
    {
      header: 'Year',
      accessor: (row) => (
        <span className="text-apple-ink-80">{row.admissionYear}</span>
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
          <h1 className="text-2xl font-bold text-apple-ink">Higher Studies</h1>
          <p className="text-apple-ink-48 text-sm mt-1">Track students pursuing higher education</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-apple-parchment rounded-lg p-1 border border-apple-hairline">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-apple-blue text-white shadow-sm'
                  : 'text-apple-ink-48 hover:text-apple-ink'
              }`}
              title="Table view"
            >
              <HiTableCells className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'card'
                  ? 'bg-apple-blue text-white shadow-sm'
                  : 'text-apple-ink-48 hover:text-apple-ink'
              }`}
              title="Card view"
            >
              <HiSquares2X2 className="w-4 h-4" />
            </button>
          </div>
          {isAdmin && (
            <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
              <HiPlus className="w-5 h-5" />
              Add Record
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-ink-48" />
            <input
              type="text"
              placeholder="Search by university..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
          <select
            value={filters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="select-field min-w-[160px]"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={filters.program}
            onChange={(e) => handleFilterChange('program', e.target.value)}
            className="select-field min-w-[140px]"
          >
            <option value="">All Programs</option>
            {PROGRAMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="glass-card overflow-hidden">
          <DataTable
            columns={columns}
            data={records}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-5 bg-apple-divider rounded w-3/4 mb-3" />
                  <div className="h-4 bg-apple-divider rounded w-1/2 mb-2" />
                  <div className="h-4 bg-apple-divider rounded w-2/3 mb-4" />
                  <div className="h-6 bg-apple-divider rounded w-20" />
                </div>
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <HiAcademicCap className="w-12 h-12 text-apple-ink-48 mx-auto mb-3" />
              <p className="text-apple-ink-48">No higher studies records found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((record) => (
                <div
                  key={record._id}
                  className="glass-card p-6 hover:border-apple-blue/30 transition-all duration-300 group relative"
                >
                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => openEditModal(record)}
                        className="p-1.5 text-apple-ink-48 hover:text-apple-blue hover:bg-apple-parchment rounded-lg transition-all"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ open: true, id: record._id })}
                        className="p-1.5 text-apple-ink-48 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Student Name */}
                  <h3 className="text-lg font-semibold text-apple-ink mb-2 pr-16">
                    {record.studentId?.name || '—'}
                  </h3>

                  {/* University */}
                  <p className="text-apple-ink-80 text-sm mb-1 font-medium">{record.university}</p>

                  {/* Country */}
                  <p className="text-apple-ink-48 text-sm mb-3">
                    {record.country}
                  </p>

                  {/* Footer: Program + Year */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-apple-divider">
                    <span className={`badge ${getProgramColor(record.program)}`}>
                      {record.program}
                    </span>
                    <span className="text-apple-ink-48 text-sm font-medium">
                      {record.admissionYear}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRecord ? 'Edit Record' : 'Add Higher Study Record'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
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
              University <span className="text-red-400">*</span>
            </label>
            <input
              name="university"
              value={form.university}
              onChange={handleFormChange}
              className="input-field w-full"
              placeholder="MIT, Stanford, etc."
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">
                Country <span className="text-red-400">*</span>
              </label>
              <select
                name="country"
                value={form.country}
                onChange={handleFormChange}
                className="select-field w-full"
                required
              >
                <option value="">Select Country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">
                Program <span className="text-red-400">*</span>
              </label>
              <select
                name="program"
                value={form.program}
                onChange={handleFormChange}
                className="select-field w-full"
                required
              >
                <option value="">Select Program</option>
                {PROGRAMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-ink-80 mb-1.5">
              Admission Year
            </label>
            <input
              name="admissionYear"
              type="number"
              min="2000"
              max="2050"
              value={form.admissionYear}
              onChange={handleFormChange}
              className="input-field w-full"
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
              ) : editingRecord ? (
                'Update Record'
              ) : (
                'Add Record'
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
        title="Delete Record"
        message="Are you sure you want to delete this higher studies record? This action cannot be undone."
      />
    </div>
  );
}
