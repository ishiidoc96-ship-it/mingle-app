import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import DesktopSidebar from '../components/DesktopSidebar'

export default function EarningsHistory() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [wallet, setWallet] = useState({ balance: 0, totalEarned: 0, pendingRewards: 0 })
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')

  useEffect(() => {
    api.get('/earnings/wallet').then(r => {
      setWallet(r.data)
      setTransactions(r.data.transactions || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = tab === 'all' ? transactions : transactions.filter(t => {
    if (tab === 'referral') return t.type === 'referral_bonus'
    if (tab === 'payment') return t.type === 'payment'
    if (tab === 'withdrawal') return t.type === 'withdrawal'
    return true
  })

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'payment', label: 'Payments' },
    { key: 'referral', label: 'Referrals' },
    { key: 'withdrawal', label: 'Withdrawals' },
  ]

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen md:ml-[240px]">
      <DesktopSidebar />
      <header className="bg-surface/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="flex items-center px-gutter h-16 max-w-container-max mx-auto">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface flex-1 text-center pr-10">Earnings History</h1>
        </div>
      </header>
      <main className="px-gutter max-w-[500px] mx-auto pb-10">
        <div className="grid grid-cols-3 gap-3 mb-lg mt-4">
          {[
            { label: 'Balance', value: `KSh ${wallet.balance.toLocaleString()}`, color: 'text-primary' },
            { label: 'Total Earned', value: `KSh ${wallet.totalEarned.toLocaleString()}`, color: 'text-[#4CAF50]' },
            { label: 'Pending', value: `KSh ${wallet.pendingRewards.toLocaleString()}`, color: 'text-[#FF9800]' },
          ].map((s, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-2xl p-3 text-center border border-outline-variant/30 shadow-sm">
              <p className={`font-headline-sm text-headline-sm font-bold ${s.color}`}>{s.value}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-md overflow-x-auto no-scrollbar">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl font-label-sm text-label-sm whitespace-nowrap transition-colors ${
                tab === t.key ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}>{t.label}</button>
          ))}
        </div>
        {loading ? <LoadingState type="list" count={5} /> : filtered.length === 0 ? (
          <EmptyState icon="receipt_long" title="No transactions" message="Your earnings and payment history will appear here." />
        ) : (
          <div className="space-y-2">
            {filtered.map(txn => (
              <div key={txn.id} className="bg-surface-container-lowest rounded-xl p-3 flex items-center gap-3 border border-outline-variant/30 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  txn.amount >= 0 ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'bg-[#E53935]/10 text-[#E53935]'
                }`}>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {txn.type === 'referral_bonus' ? 'emoji_events' : txn.type === 'withdrawal' ? 'money_off' : 'payments'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body-md text-body-md text-on-surface">{txn.description || txn.type}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{new Date(txn.created_at + 'Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <p className={`font-label-md text-label-md font-bold ${txn.amount >= 0 ? 'text-[#4CAF50]' : 'text-[#E53935]'}`}>
                  {txn.amount >= 0 ? '+' : ''}KSh {Math.abs(txn.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
