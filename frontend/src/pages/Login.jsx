import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { show } = useToast()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!identifier.trim() || !password.trim()) return setError('Please fill in all fields')
    setError('')
    setLoading(true)
    try {
      await login(identifier, password)
      show('Welcome back!', 'success')
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md antialiased overflow-hidden flex items-center justify-center relative">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primary-fixed-dim/30 blur-[120px] mix-blend-multiply opacity-70"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-tertiary-fixed-dim/30 blur-[100px] mix-blend-multiply opacity-60"></div>
      </div>
      <main className="relative z-10 w-full max-w-md mx-auto px-gutter py-lg">
        <div className="glass-panel rounded-[24px] shadow-[0_10px_30px_rgba(216,27,96,0.1)] border border-surface-variant overflow-hidden p-md md:p-lg flex flex-col items-center">
          <div className="mb-8 w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container shadow-sm border border-primary-fixed/50 scale-in">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          </div>
          <div className="text-center mb-8 w-full">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2 tracking-tight">Welcome Back</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Login to your Mingle account.</p>
          </div>
          {error && (
            <div className="w-full bg-error-container/80 text-on-error-container p-3 rounded-xl font-label-sm text-label-sm mb-4 flex items-center gap-2 slide-up">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="w-full space-y-6 flex flex-col">
            <div className="space-y-4 w-full">
              <div className="relative w-full">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1" htmlFor="identifier">Email or Phone</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">person</span>
                  <input id="identifier" type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-surface rounded-xl border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/40 shadow-sm"
                    placeholder="Enter your email or phone" required autoFocus />
                </div>
              </div>
              <div className="relative w-full">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">lock</span>
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-surface rounded-xl border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/40 shadow-sm"
                    placeholder="Enter your password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors outline-none">
                    <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end w-full">
              <a className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors duration-200 cursor-pointer">Forgot Password?</a>
            </div>
            <div className="w-full flex flex-col gap-4 mt-2">
              <button type="submit" disabled={loading}
                className="w-full h-[56px] gradient-btn text-on-primary font-label-md text-label-md rounded-xl shadow-[0_4px_14px_rgba(216,27,96,0.3)] hover:shadow-[0_6px_20px_rgba(216,27,96,0.4)] hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0">
                {loading ? (
                  <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /><span>Logging in...</span></>
                ) : (
                  <><span>Login</span><span className="material-symbols-outlined text-lg">arrow_forward</span></>
                )}
              </button>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-surface-variant"></div>
                <span className="flex-shrink-0 mx-4 font-label-sm text-label-sm text-on-surface-variant/60">or</span>
                <div className="flex-grow border-t border-surface-variant"></div>
              </div>
              <Link to="/signup"
                className="w-full h-[56px] bg-transparent border-[1.5px] border-primary/20 text-primary font-label-md text-label-md rounded-xl hover:bg-primary/5 hover:border-primary/50 active:bg-primary/10 transition-all duration-200 flex items-center justify-center">
                Create Account
              </Link>
            </div>
          </form>
        </div>
        <div className="mt-8 text-center text-on-surface-variant/60 font-label-sm text-label-sm w-full">
          By logging in, you agree to our <a className="text-primary hover:underline cursor-pointer">Terms</a> & <a className="text-primary hover:underline cursor-pointer">Privacy Policy</a>
        </div>
      </main>
    </div>
  )
}
