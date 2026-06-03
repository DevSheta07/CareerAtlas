import { useEffect, useCallback } from 'react';
import { HiExclamationTriangle } from 'react-icons/hi2';

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  onClose,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this record? This action cannot be undone.',
}) {
  const handleCancel = onCancel || onClose;

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') handleCancel?.();
    },
    [handleCancel]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleCancel}
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-sm bg-white border border-apple-hairline rounded-apple-lg p-6 animate-slide-up"
        style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-5">
          <div className="p-4 rounded-full bg-red-50 border border-red-200">
            <HiExclamationTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-apple-ink mb-2">{title}</h3>
          <p className="text-sm text-apple-ink-48 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="btn-secondary flex-1 text-center justify-center"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger flex-1 text-center justify-center"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
