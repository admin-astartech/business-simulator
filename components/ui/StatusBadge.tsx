interface StatusBadgeProps {
  status: 'Active' | 'Pending' | 'Inactive'
  className?: string
}

const statusConfig = {
  Active: {
    classes: 'bg-green-100 text-green-800',
    label: 'Active'
  },
  Pending: {
    classes: 'bg-yellow-100 text-yellow-800',
    label: 'Pending'
  },
  Inactive: {
    classes: 'bg-red-100 text-red-800',
    label: 'Inactive'
  }
} as const

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.classes} ${className}`}>
      {config.label}
    </span>
  )
}
