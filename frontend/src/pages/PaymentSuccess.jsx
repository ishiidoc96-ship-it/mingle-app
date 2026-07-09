import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const colors = ['#d81b60', '#8d22a9', '#fcd400', '#ffd9de', '#a941c4']
    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div')
      el.style.cssText = `
        position: absolute; width: ${Math.random() * 8 + 6}px; height: ${Math.random() * 10 + 10}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw; top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confettiFall ${Math.random() * 2 + 2}s ease-in ${Math.random() * 2}s forwards;
        pointer-events: none;
      `
      container.appendChild(el)
    }
  }, [])

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-body-md antialiased">
      <div className="absolute inset-0 pointer-events-none z-0" ref={containerRef}></div>
      <main className="relative z-10 w-full max-w-md px-gutter md:px-0 mx-auto flex flex-col items-center text-center">
        <div className="relative w-32 h-32 mb-lg flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary-container/20 animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-4 rounded-full bg-primary-container/40 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-container to-tertiary-container shadow-[0_10px_30px_rgba(216,27,96,0.3)] flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
        </div>
        <div className="space-y-md mb-xl w-full">
          <h1 className="font-headline-xl text-headline-xl text-primary md:font-headline-lg md:text-headline-lg">Welcome to Mingle!</h1>
          <div className="bg-surface-container rounded-2xl p-md shadow-sm border border-outline-variant/30">
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-sm">Payment successful.</p>
            <div className="flex items-center justify-center gap-xs text-primary-container bg-primary-container/10 py-xs px-sm rounded-xl inline-flex mx-auto">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <p className="font-label-md text-label-md font-bold">The person who invited you has earned KSh 50!</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/profile-setup')}
          className="w-full h-[56px] rounded-xl bg-gradient-to-b from-primary-container to-tertiary flex items-center justify-center text-on-primary font-label-md text-label-md shadow-[0_10px_30px_rgba(216,27,96,0.2)] hover:opacity-90 active:scale-95 transition-all duration-200">
          Continue to Profile Setup
          <span className="material-symbols-outlined ml-xs text-[20px]">arrow_forward</span>
        </button>
      </main>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-container/5 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-tertiary-container/5 blur-[120px]"></div>
      </div>
    </div>
  )
}
