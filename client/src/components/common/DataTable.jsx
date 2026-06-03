import {
  HiPencilSquare,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
  HiInboxStack,
} from 'react-icons/hi2';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  onEdit,
  onDelete,
  page = 1,
  totalPages = 1,
  onPageChange,
  showActions = true,
}) {
  const hasActions = showActions && (onEdit || onDelete);

  // Skeleton loader rows
  if (loading) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-apple-parchment">
                {columns.map((col) => (
                  <th
                    key={col.key || col.header}
                    className="px-6 py-4 text-left text-xs font-semibold text-apple-ink-48 uppercase tracking-wider"
                  >
                    {col.header || col.label}
                  </th>
                ))}
                {hasActions && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-apple-ink-48 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-apple-divider">
                  {columns.map((col) => (
                    <td key={col.key || col.header} className="px-6 py-4">
                      <div className="skeleton h-4 rounded-md w-3/4" />
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-6 py-4">
                      <div className="skeleton h-4 rounded-md w-16" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="p-4 rounded-apple-lg bg-apple-parchment mb-4">
            <HiInboxStack className="w-12 h-12 text-apple-ink-48" />
          </div>
          <h3 className="text-lg font-semibold text-apple-ink mb-1">
            No records found
          </h3>
          <p className="text-sm text-apple-ink-48">
            There are no records to display at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="bg-apple-parchment">
              {columns.map((col) => (
                <th
                  key={col.key || col.header}
                  className="px-6 py-4 text-left text-xs font-semibold text-apple-ink-48 uppercase tracking-wider"
                >
                  {col.header || col.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-4 text-right text-xs font-semibold text-apple-ink-48 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row._id || row.id || rowIndex}
                className="border-b border-apple-divider hover:bg-apple-parchment/60 transition-colors duration-150 group"
              >
                {columns.map((col) => (
                  <td
                    key={col.key || col.header}
                    className="px-6 py-4 text-sm text-apple-ink-80 whitespace-nowrap"
                  >
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : typeof col.accessor === 'string'
                      ? (row[col.accessor] ?? '—')
                      : col.render
                      ? col.render(row[col.key], row)
                      : (row[col.key] ?? '—')}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-2 rounded-apple-sm text-apple-blue hover:bg-apple-blue/[0.08] transition-colors"
                          title="Edit"
                        >
                          <HiPencilSquare className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-2 rounded-apple-sm text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-apple-divider">
          <p className="text-sm text-apple-ink-48">
            Page{' '}
            <span className="font-semibold text-apple-ink">{page}</span>{' '}
            of{' '}
            <span className="font-semibold text-apple-ink">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-apple-sm text-apple-ink-48 hover:text-apple-ink hover:bg-apple-parchment transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-apple-sm text-apple-ink-48 hover:text-apple-ink hover:bg-apple-parchment transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
