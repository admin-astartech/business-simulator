import React from 'react'

export interface TableColumn<T> {
  key: string
  header: string
  render?: (item: T, index: number) => React.ReactNode
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  onRowClick?: (item: T, index: number) => void
  emptyMessage?: string
  title?: string
  className?: string
  rowClassName?: string
  headerClassName?: string
}

export default function DataTable<T>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'No data found',
  title,
  className = '',
  rowClassName = '',
  headerClassName = ''
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md ${className}`}>
        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
        )}
        <div className="p-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className={`bg-gray-50 ${headerClassName}`}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider ${column.headerClassName || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((item, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 transition-colors border-b border-gray-200 ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${rowClassName}`}
                onClick={() => onRowClick?.(item, index)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
                  >
                    {column.render ? column.render(item, index) : (item as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
