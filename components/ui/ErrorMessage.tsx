interface ErrorMessageProps {
  title?: string
  message: string
  icon?: string
  onRetry?: () => void
}

export default function ErrorMessage({ 
  title = 'Error loading data',
  message,
  icon = '⚠️',
  onRetry
}: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">{icon}</div>
        <p className="text-red-600 text-lg mb-2">{title}</p>
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
