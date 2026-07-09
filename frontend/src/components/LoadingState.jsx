export default function LoadingState({ type = 'cards', count = 3 }) {
  if (type === 'list') {
    return (
      <div className="space-y-3 p-gutter animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 bg-surface-container-lowest rounded-xl p-3">
            <div className="w-14 h-14 rounded-full bg-surface-variant" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-variant rounded w-3/4" />
              <div className="h-3 bg-surface-variant rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md p-gutter animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface-container-lowest rounded-2xl overflow-hidden">
          <div className="h-64 bg-surface-variant" />
          <div className="p-4 space-y-2">
            <div className="h-5 bg-surface-variant rounded w-2/3" />
            <div className="h-4 bg-surface-variant rounded w-1/2" />
            <div className="h-4 bg-surface-variant rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
