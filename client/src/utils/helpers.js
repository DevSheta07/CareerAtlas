export const formatPackage = (lpa) => {
  if (!lpa && lpa !== 0) return '—';
  return `₹${Number(lpa).toFixed(2)} LPA`;
};

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status) => {
  const map = {
    placed: 'badge-success',
    higher_studies: 'badge-info',
    unplaced: 'badge-neutral',
    active: 'badge-success',
    completed: 'badge-info',
    cancelled: 'badge-danger',
  };
  return map[status] || 'badge-neutral';
};

export const getStatusLabel = (status) => {
  const map = {
    placed: 'Placed',
    higher_studies: 'Higher Studies',
    unplaced: 'Unplaced',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
    'on-campus': 'On Campus',
    'off-campus': 'Off Campus',
    internship: 'Internship',
  };
  return map[status] || status;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getProgramColor = (program) => {
  const map = {
    MS: 'badge-purple',
    MTech: 'badge-info',
    MBA: 'badge-warning',
    PhD: 'badge-success',
  };
  return map[program] || 'badge-neutral';
};

export const daysUntil = (date) => {
  if (!date) return null;
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
