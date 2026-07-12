import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useToast } from '../context/ToastContext'
import DesktopSidebar from '../components/DesktopSidebar'

export default function Withdrawal() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [balance, setBalance] = useState(0)
  const [minWithdrawal, setMinWithdrawal] = useState(500)
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/earnings/wallet').then(res => {
      setBalance(res.data.balance || 0)
      setMinWithdrawal(res.data.minWithdrawal || 500)
    }).catch(() => {})
  }, [])

  const handleWithdraw = async () => {
    const amt = parseFloat(amount)
    if (!phone.trim()) return setError('Enter your M-Pesa phone number')
    if (!amt || amt < minWithdrawal) return setError(`Minimum withdrawal is KSh ${minWithdrawal}`)
    if (amt > balance) return setError('Insufficient balance')
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/earnings/withdraw', { amount: amt, phone })
      show(res.data.message || 'Withdrawal submitted!', 'success')
      navigate('/earnings')
    } catch (err) {
      setError(err.response?.data?.error || 'Withdrawal failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md antialiased overflow-x-hidden flex flex-col md:ml-[240px]">
      <DesktopSidebar />
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center px-gutter h-16 max-w-container-max mx-auto">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface flex-1 text-center pr-10">Withdraw Funds</h1>
        </div>
      </header>
      <main className="flex-1 w-full max-w-[500px] mx-auto px-gutter pt-24 pb-10">
        <div className="bg-surface-container-lowest rounded-[24px] p-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 mb-md">
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Available Balance</p>
          <p className="font-headline-xl text-headline-xl text-primary font-bold">KSh {balance.toLocaleString()}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Minimum withdrawal: KSh {minWithdrawal}</p>
        </div>
        {error && (
          <div className="bg-error-container/80 text-on-error-container p-3 rounded-xl font-label-sm text-label-sm mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>{error}
          </div>
        )}
        <div className="bg-surface-container-lowest rounded-[24px] p-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 space-y-4">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">M-Pesa Phone Number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full py-3 px-4 border border-surface-variant rounded-xl bg-surface-container-lowest text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="0712 345 678" />
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">Amount (KSh)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min={minWithdrawal}
              className="w-full py-3 px-4 border border-surface-variant rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-headline-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder={`Min. KSh ${minWithdrawal}`} />
          </div>
          <div className="bg-surface-container-high rounded-xl p-3">
            <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Processing time</span><span className="text-on-surface font-medium">24-48 hours</span></div>
            <div className="flex justify-between text-sm mt-1"><span className="text-on-surface-variant">Fee</span><span className="text-on-surface font-medium">Free</span></div>
          </div>
        </div>
      </main>
      <div className="fixed bottom-0 w-full z-50 bg-surface/90 backdrop-blur-lg border-t border-outline-variant/30 pb-safe p-gutter shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-container-max mx-auto">
          <div className="max-w-[500px] mx-auto">
            <button onClick={handleWithdraw} disabled={loading}
              className="w-full h-[56px] rounded-xl bg-gradient-to-b from-primary to-tertiary text-on-primary font-label-md text-label-md shadow-[0_10px_30px_rgba(216,27,96,0.2)] hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Processing...</>
              ) : 'Withdraw Funds'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
