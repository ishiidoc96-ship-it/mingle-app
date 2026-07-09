import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function SignUp() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { show } = useToast()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = field => e => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.phone || !form.password) return setError('All fields are required')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      show('Account created!', 'success')
      navigate('/referral-code', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col md:flex-row antialiased">
      <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-primary-container/5 to-tertiary/5 overflow-hidden shadow-2xl z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-md px-xl">
            <div className="w-20 h-20 rounded-full bg-primary-container/10 flex items-center justify-center mx-auto mb-8">
              <span className="material-symbols-outlined text-5xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_3</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Connect.<br />Engage.<br />Earn.</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant opacity-90">Join the exclusive social network where your interactions generate real value.</p>
          </div>
        </div>
      </div>
      <main className="w-full md:w-1/2 flex-1 flex flex-col justify-center px-gutter py-md relative z-20 md:min-h-screen">
        <div className="md:hidden pt-8"></div>
        <div className="w-full max-w-[440px] mx-auto bg-surface-container-lowest md:bg-transparent md:shadow-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-2xl p-md md:p-0 relative">
          <div className="mb-8 md:hidden text-center">
            <span className="font-headline-md text-headline-md font-bold text-primary">Mingle</span>
          </div>
          <div className="mb-10 text-center md:text-left">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Create Account</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Join the community and start earning.</p>
          </div>
          {error && (
            <div className="w-full bg-error-container/80 text-on-error-container p-3 rounded-xl font-label-sm text-label-sm mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="name">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">person</span>
                </span>
                <input id="name" type="text" value={form.name} onChange={update('name')} required
                  className="block w-full pl-10 pr-3 py-3.5 border border-surface-variant rounded-xl focus:ring-1 focus:ring-primary focus:border-primary bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder-outline transition-colors"
                  placeholder="John Doe" autoFocus />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">mail</span>
                </span>
                <input id="email" type="email" value={form.email} onChange={update('email')} required
                  className="block w-full pl-10 pr-3 py-3.5 border border-surface-variant rounded-xl focus:ring-1 focus:ring-primary focus:border-primary bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder-outline transition-colors"
                  placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="phone">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">phone</span>
                </span>
                <input id="phone" type="tel" value={form.phone} onChange={update('phone')} required
                  className="block w-full pl-10 pr-3 py-3.5 border border-surface-variant rounded-xl focus:ring-1 focus:ring-primary focus:border-primary bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder-outline transition-colors"
                  placeholder="0712 345 678" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">lock</span>
                </span>
                <input id="password" type="password" value={form.password} onChange={update('password')} required
                  className="block w-full pl-10 pr-3 py-3.5 border border-surface-variant rounded-xl focus:ring-1 focus:ring-primary focus:border-primary bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder-outline transition-colors"
                  placeholder="Min. 6 characters" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="confirm_password">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">lock_clock</span>
                </span>
                <input id="confirm_password" type="password" value={form.confirmPassword} onChange={update('confirmPassword')} required
                  className="block w-full pl-10 pr-3 py-3.5 border border-surface-variant rounded-xl focus:ring-1 focus:ring-primary focus:border-primary bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder-outline transition-colors"
                  placeholder="Repeat your password" />
              </div>
            </div>
            <div className="flex items-start mt-4">
              <div className="flex items-center h-5">
                <input id="terms" type="checkbox" required
                  className="h-4 w-4 text-primary focus:ring-primary border-outline rounded bg-surface-container-lowest" />
              </div>
              <div className="ml-3">
                <label className="font-body-md text-body-md text-on-surface-variant" htmlFor="terms">I agree to the <a className="text-primary hover:text-primary-container font-semibold transition-colors cursor-pointer">Terms of Service</a> and <a className="text-primary hover:text-primary-container font-semibold transition-colors cursor-pointer">Privacy Policy</a>.</label>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex justify-center py-4 px-4 rounded-xl shadow-[0_10px_30px_rgba(216,27,96,0.2)] font-label-md text-label-md text-on-primary bg-gradient-to-b from-primary-container to-tertiary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary active:scale-[0.98] transition-all duration-200 disabled:opacity-50">
              {loading ? (
                <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />Creating Account...</>
              ) : 'Continue'}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account? <Link className="font-semibold text-primary hover:text-primary-container transition-colors" to="/login">Login</Link>
            </p>
          </div>
        </div>
        <div className="md:hidden pb-12"></div>
      </main>
    </div>
  )
}
