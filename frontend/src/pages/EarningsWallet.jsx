import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import BottomNav from '../components/BottomNav'
import DesktopSidebar from '../components/DesktopSidebar'
import AnimatedNumber from '../components/AnimatedNumber'

export default function EarningsWallet() {
  const navigate = useNavigate()
  const [data, setData] = useState({ balance: 0, totalEarned: 0, pendingRewards: 0, transactions: [] })
  const [withdrawPhone, setWithdrawPhone] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/earnings/wallet').then(res => setData(res.data)).catch(() => {})
  }, [])

  const handleWithdraw = async () => {
    const amt = parseFloat(withdrawAmount)
    if (!withdrawPhone || !withdrawAmount) return
    if (amt < 500) { setMsg('Minimum withdrawal is KSh 500'); return }
    if (amt > data.balance) { setMsg('Insufficient balance'); return }
    setWithdrawing(true)
    setMsg('')
    try {
      const res = await api.post('/earnings/withdraw', { phone: withdrawPhone, amount: amt })
      setMsg(res.data.message)
      setWithdrawPhone('')
      setWithdrawAmount('')
      const updated = await api.get('/earnings/wallet')
      setData(updated.data)
    } catch (err) {
      setMsg(err.response?.data?.error || 'Withdrawal failed')
    } finally { setWithdrawing(false) }
  }

  return (
    <>
    <DesktopSidebar />
    <div className="bg-surface min-h-screen pb-32 md:pb-16 md:ml-[240px]">
      <header className="bg-surface/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center px-gutter h-16 max-w-container-max mx-auto">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Wallet</h1>
          <button onClick={() => navigate('/earnings-history')} className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">receipt_long</span>
          </button>
        </div>
      </header>
      <main className="w-full max-w-3xl mx-auto px-gutter py-lg flex flex-col gap-lg">
        <section className="flex flex-col items-center text-center space-y-md">
          <div className="w-full rounded-2xl p-lg bg-gradient-to-br from-primary via-primary-container to-tertiary shadow-[0_10px_40px_rgba(216,27,96,0.2)] flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
            <span className="font-label-md text-label-md text-white/80 uppercase tracking-widest mb-2">Available Balance</span>
            <div className="font-headline-xl text-headline-xl text-white tracking-tight">
              KSh <AnimatedNumber value={data.balance} />
            </div>
            <div className="mt-4 w-full space-y-2">
              <input type="tel" value={withdrawPhone} onChange={e => setWithdrawPhone(e.target.value)}
                className="w-full py-3 px-4 border border-white/20 rounded-xl bg-white/10 text-white font-body-md placeholder:text-white/50 focus:border-white/40 focus:ring-1 focus:ring-white/30 outline-none backdrop-blur-sm"
                placeholder="M-Pesa phone number" />
              <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                className="w-full py-3 px-4 border border-white/20 rounded-xl bg-white/10 text-white font-body-md placeholder:text-white/50 focus:border-white/40 focus:ring-1 focus:ring-white/30 outline-none backdrop-blur-sm"
                placeholder="Amount to withdraw" />
              <button onClick={handleWithdraw} disabled={withdrawing}
                className="w-full h-14 bg-white/20 backdrop-blur-md rounded-xl text-white font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-white/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 border border-white/20">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                {withdrawing ? 'Processing...' : 'Withdraw to M-Pesa'}
              </button>
              {msg && <p className="font-label-sm text-label-sm text-white/90 bg-white/10 rounded-lg px-3 py-1.5 inline-block">{msg}</p>}
            </div>
          </div>
        </section>
        <section className="grid grid-cols-2 gap-sm md:gap-md">
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center gap-2 mb-sm">
              <span className="w-8 h-8 rounded-lg bg-[#4CAF50]/10 flex items-center justify-center text-[#4CAF50]">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Total Earned</span>
            </div>
            <div className="font-headline-md text-headline-md text-on-surface">KSh <AnimatedNumber value={data.totalEarned} /></div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center gap-2 mb-sm">
              <span className="w-8 h-8 rounded-lg bg-[#FF9800]/10 flex items-center justify-center text-[#FF9800]">
                <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Pending Rewards</span>
            </div>
            <div className="font-headline-md text-headline-md text-on-surface">KSh <AnimatedNumber value={data.pendingRewards} /></div>
          </div>
        </section>
        <section className="flex flex-col gap-sm">
          <div className="flex justify-between items-end mb-xs">
            <h2 className="font-headline-md text-headline-md text-on-surface">Transactions</h2>
            <button onClick={() => navigate('/earnings-history')} className="font-label-sm text-label-sm text-primary hover:underline">View All</button>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden border border-outline-variant/30">
            {data.transactions.length === 0 ? (
              <p className="text-center py-8 font-body-md text-body-md text-on-surface-variant">No transactions yet.</p>
            ) : (
              <div className="flex flex-col">
                {data.transactions.slice(0, 10).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-md hover:bg-surface-container-low transition-colors border-b border-surface-container last:border-b-0 hover:pl-lg cursor-default" style={{ transition: 'padding-left 0.2s' }}>
                    <div className="flex items-center gap-md">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === 'referral_bonus' ? 'bg-[#4CAF50]/10 text-[#4CAF50]' :
                        tx.type === 'withdrawal' ? 'bg-[#E53935]/10 text-[#E53935]' :
                        'bg-primary/10 text-primary'
                      }`}>
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {tx.type === 'referral_bonus' ? 'emoji_events' : tx.type === 'withdrawal' ? 'arrow_upward' : 'payment'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body-md text-body-md text-on-surface font-medium">{tx.description}</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{new Date(tx.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className={`font-label-md text-label-md font-bold text-right ${
                      tx.amount > 0 ? 'text-[#4CAF50]' : 'text-on-surface'
                    }`}>
                      <AnimatedNumber value={tx.amount} prefix={tx.amount > 0 ? '+KSh ' : 'KSh '} duration={800} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
    </>
  )
}
