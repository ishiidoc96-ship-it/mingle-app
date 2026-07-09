import { useNavigate } from 'react-router-dom'

export default function ComingSoon({ title, icon }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-gutter text-center">
      <div className="w-24 h-24 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container mb-6">
        <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon || 'construction'}</span>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">{title}</h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mb-8">This feature is coming soon. We're working hard to bring it to you!</p>
      <button onClick={() => navigate('/home')}
        className="h-12 px-8 gradient-btn rounded-xl font-label-md text-label-md text-on-primary shadow-[0_4px_14px_rgba(216,27,96,0.3)] hover:shadow-[0_6px_20px_rgba(216,27,96,0.4)] active:scale-[0.98] transition-all duration-200 flex items-center gap-2">
        <span className="material-symbols-outlined text-lg">home</span>
        Go Home
      </button>
    </div>
  )
}
