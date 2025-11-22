interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <div className="h-7 w-7 rounded-xl border-2 border-white/70 border-t-transparent animate-spin" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-2 w-14 bg-blue-200 rounded-full blur-md opacity-60" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-gray-800">Loading CareerHub</p>
          <p className="text-xs text-gray-500 max-w-xs">
            {message || 'Fetching data and polishing your careers experience...'}
          </p>
        </div>
      </div>
    </div>
  );
}
