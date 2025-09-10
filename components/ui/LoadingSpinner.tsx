import CircularProgress from "@mui/material/CircularProgress"

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
}: LoadingSpinnerProps) {

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <CircularProgress size={60}/>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
