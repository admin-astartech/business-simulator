import CircularProgress from "@mui/material/CircularProgress"

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <CircularProgress size={60} />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
