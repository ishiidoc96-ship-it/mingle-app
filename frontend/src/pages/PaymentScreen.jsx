import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import api from '../api'

export default function PaymentScreen() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [method, setMethod] = useState('mpesa')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [checking, setChecking] = useState(false)
  const pollRef = useRef(null)

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  useEffect(() => () => stopPolling(), [])

  const startPolling = () => {
    stopPolling()
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await api.get('/payments/status')
        if (data && data.paid) {
          stopPolling()
          setChecking(false)
          show('Payment successful! Welcome to Mingle 🎉', 'success')
          navigate('/payment-success', { replace: true })
        }
      } catch {
        // still waiting
      }
    }, 3000)
  }

  const handlePay = async () => {
    if (method === 'mpesa' && !phone.trim()) return setError('Please enter your M-Pesa phone number')
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/payments/initiate', {
        method,
        phone: method === 'mpesa' ? phone : undefined,
      })
      if (data?.success === false && !data.checkoutRequestId) {
        setError(data.message || 'Failed to initiate payment. Try again.')
        return
      }
      setSubmitted(true)
      setChecking(true)
      startPolling()
    } catch (err) {
      const message = err.response?.data?.error || err.message
      if (message === 'Already paid') {
        navigate('/payment-success', { replace: true })
        return
      }
      setError(message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const methods = [
    { value: 'mpesa', label: 'M-Pesa', sub: 'Pay via Safaricom Lipa Na M-Pesa', icon: 'phone_iphone', color: '#4CAF50' },
  ]

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md antialiased overflow-x-hidden flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm h-16 flex items-center px-gutter mx-auto max-w-container-max">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 text-on-surface-variant">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-md text-headline-md text-on-surface flex-1 text-center pr-10">Checkout</h1>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-gutter pt-24 pb-36">
        <section className="mb-lg slide-up">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">Order Summary</h2>
          <div className="bg-surface-container-lowest rounded-[24px] p-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
              <div>
                <p className="font-body-md text-body-md text-on-surface font-medium">Premium Membership</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">Full access • No ads</p>
              </div>
            </div>
            <div className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">KSh 100</div>
          </div>
        </section>

        {error && (
          <div className="bg-error-container/80 text-on-error-container p-3 rounded-xl font-label-sm text-label-sm mb-4 flex items-center gap-2 slide-up">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        {!submitted ? (
          <section className="slide-up stagger-2">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">Select Payment Method</h2>
            <div className="space-y-sm">
              {methods.map((m) => (
                <label key={m.value} className="block cursor-pointer group">
                  <input
                    type="radio"
                    name="payment_method"
                    value={m.value}
                    checked={method === m.value}
                    onChange={() => { setMethod(m.value); setError('') }}
                    className="peer sr-only"
                  />
                  <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-3 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary-container/5 transition-all shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${m.color}15`, color: m.color }}>
                      <span className="material-symbols-outlined filled">{m.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-label-md text-label-md text-on-surface">{m.label}</h3>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{m.sub}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-outline-variant peer-checked:border-primary flex items-center justify-center flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full bg-primary transition-transform duration-200 ${method === m.value ? 'scale-100' : 'scale-0'}`}></div>
                    </div>
                  </div>
                  {m.value === 'mpesa' && method === 'mpesa' && (
                    <div className="mt-2 pl-16 slide-up">
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full py-3 px-4 border border-surface-variant rounded-xl bg-surface-container-lowest text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="M-Pesa phone number (e.g. 0712...)"
                        autoFocus={method === 'mpesa'}
                      />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </section>
        ) : (
          <section className="slide-up">
            <div className="bg-surface-container-lowest rounded-[24px] p-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>phone_iphone</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface font-medium">M-Pesa STK Push sent</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">Please complete the payment on your phone by entering your M-Pesa PIN.</p>
                </div>
              </div>
            </div>
            {checking && (
              <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                <div className="w-4 h-4 rounded-full border-2 border-surface-variant border-t-primary animate-spin"></div>
                Waiting for payment confirmation…
              </div>
            )}
          </section>
        )}
      </main>

      <div className="fixed bottom-0 w-full z-50 bg-surface/90 backdrop-blur-lg border-t border-outline-variant/30 pb-safe p-gutter shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-container-max mx-auto flex items-center gap-sm">
          {!submitted ? (
            <button
              onClick={handlePay}
              disabled={loading || method === 'mpesa' && !phone.trim()}
              className="flex-1 h-[56px] rounded-xl bg-gradient-to-b from-primary to-tertiary text-on-primary font-label-md text-label-md shadow-[0_10px_30px_rgba(216,27,96,0.2)] hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Processing…</>
              ) : (
                <><span className="material-symbols-outlined">lock</span>Pay KSh 100</>
              )}
            </button>
          ) : (
            <button
              disabled
              className="flex-1 h-[56px] rounded-xl bg-surface-container-high text-on-surface-variant font-label-md text-label-md flex items-center justify-center gap-2"
            >
              <div className="w-5 h-5 rounded-full border-2 border-surface-variant border-t-primary animate-spin"></div>
              {checking ? 'Waiting for confirmation…' : 'Payment in progress'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
