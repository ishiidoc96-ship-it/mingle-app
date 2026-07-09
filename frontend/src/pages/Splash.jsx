import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Splash() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) navigate('/home', { replace: true })
      else navigate('/onboarding', { replace: true })
    }, 2500)
    return () => clearTimeout(timer)
  }, [navigate, user])

  return (
    <div className="bg-surface-container-lowest text-on-surface h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-tertiary/5 blur-[100px]"></div>
      </div>
      <main className="flex flex-col items-center justify-center z-10 w-full px-gutter">
        <div className="animate-fade-in-up logo-pulse mb-md">
          <svg className="text-primary-container" fill="none" height="96" viewBox="0 0 96 96" width="96" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 72V36C24 29.3726 29.3726 24 36 24C40.6698 24 44.7176 26.6663 46.5415 30.6558C47.4143 32.5651 50.5857 32.5651 51.4585 30.6558C53.2824 26.6663 57.3302 24 62 24C68.6274 24 74 29.3726 74 36V72" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
            <path d="M49 60C49 60 49 76 36 76C29.3726 76 24 70.6274 24 64" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
            <path d="M49 60C49 60 49 76 62 76C68.6274 76 74 70.6274 74 64" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
            <circle cx="49" cy="48" fill="currentColor" r="8" />
          </svg>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-sm tracking-tight animate-fade-in-up delay-100">Mingle</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant text-center max-w-[280px] animate-fade-in-up delay-300">Meet. Connect. Earn.</p>
      </main>
      <div className="absolute bottom-16 flex flex-col items-center z-10 animate-fade-in-up delay-500">
        <div className="w-10 h-10 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin shadow-[0_4px_20px_rgba(216,27,96,0.15)]"></div>
      </div>
    </div>
  )
}
