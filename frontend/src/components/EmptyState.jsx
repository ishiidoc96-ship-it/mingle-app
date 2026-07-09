export default function EmptyState({ icon = 'inbox', title = 'Nothing here yet', message = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-xl px-gutter">
      <div className="w-24 h-24 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container mb-md">
        <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">{title}</h3>
      {message && <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mb-md">{message}</p>}
      {action && (
        <button onClick={action.onClick}
          className="h-[52px] px-lg rounded-xl bg-gradient-to-b from-primary to-tertiary text-on-primary font-label-md text-label-md shadow-[0_10px_30px_rgba(216,27,96,0.2)] hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
          {action.label}
        </button>
      )}
    </div>
  )
}
