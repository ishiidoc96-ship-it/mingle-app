import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, showBack = false, rightIcon }) {
  const navigate = useNavigate()

  return (
    <header className="bg-surface/80 backdrop-blur-md shadow-sm fixed top-0 w-full z-50">
      <div className="flex justify-between items-center px-gutter h-16 w-full max-w-container-max mx-auto">
        <div className="w-10">
          {showBack && (
            <button onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          )}
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary tracking-tight">
          {title}
        </h1>
        <div className="w-10 flex items-center justify-center">
          {rightIcon && (
            <button className="text-on-surface-variant hover:bg-surface-container-high rounded-full w-10 h-10 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined">{rightIcon}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
