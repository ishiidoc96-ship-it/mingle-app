import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import api from '../api'

export default function ReferralCodeEntry() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (code.trim()) {
        const { data } = await api.post('/referrals/submit', { referralCode: code.trim() })
        show(data.message || 'Referral applied!', 'success')
      }
    } catch (err) {
      if (err.response?.status !== 404) show(err.response?.data?.error || 'Invalid code', 'info')
    }
    setLoading(false)
    navigate('/payment')
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md antialiased overflow-hidden flex flex-col">
      <header className="w-full flex justify-between items-center px-gutter h-16 max-w-container-max mx-auto absolute top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-headline-md text-headline-md text-primary font-bold">Mingle</span>
        <div className="w-10"></div>
      </header>
      <main className="flex-grow flex items-center justify-center p-gutter relative z-10 w-full max-w-container-max mx-auto mt-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-3xl max-h-[800px] opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, #ffd9de 0%, transparent 70%)' }} />
        <div className="glass-panel w-full max-w-md rounded-[24px] p-lg flex flex-col items-center text-center relative z-20">
          <div className="w-20 h-20 rounded-full bg-primary-container/10 flex items-center justify-center mb-md text-primary-container scale-in">
            <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-base">Got a Referral Code?</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-xl px-4">Enter it here to help your friend earn KSh 50.</p>
          <div className="w-full mb-xl">
            <label className="sr-only" htmlFor="referralCode">Referral Code</label>
            <div className="relative rounded-xl transition-all duration-200" style={{ boxShadow: code ? '0 0 0 2px #d81b6040' : 'none' }}>
              <input id="referralCode" type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} maxLength={10}
                className="w-full h-16 bg-surface-container-lowest border border-outline-variant text-center font-headline-md text-headline-md text-on-surface rounded-xl focus:border-primary focus:ring-0 uppercase tracking-[0.2em] placeholder:text-surface-dim transition-colors"
                placeholder="ENTER CODE" autoFocus />
            </div>
          </div>
          <div className="w-full flex flex-col gap-md">
            <button onClick={handleSubmit} disabled={loading}
              className="gradient-btn w-full h-[56px] rounded-xl font-label-md text-label-md text-on-primary flex items-center justify-center disabled:opacity-50 active:scale-[0.98] transition-all duration-200">
              {loading ? (
                <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />Submitting...</>
              ) : 'Continue'}
            </button>
            <button onClick={() => navigate('/payment')} className="text-primary font-label-md text-label-md hover:text-tertiary transition-colors py-2">
              Continue without referral
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
