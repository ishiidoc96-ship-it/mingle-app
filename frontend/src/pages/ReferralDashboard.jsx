import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import DesktopSidebar from '../components/DesktopSidebar'
import BottomNav from '../components/BottomNav'

export default function ReferralDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { show } = useToast()
  const [copied, setCopied] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [referralStats, setReferralStats] = useState({ total: 5, pending: 2, completed: 3, earnings: 150 })

  const referralCode = user?.referral_code || 'LOADING'
  const referralLink = `https://mingle.co.ke/join/${referralCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopied(true); show('Code copied!', 'success')
      setTimeout(() => setCopied(false), 3000)
    } catch { show('Copy failed', 'error') }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Join Mingle!', text: 'Join me on Mingle!', url: referralLink })
      } catch { }
    } else { setShowShare(!showShare) }
  }

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen pb-24 md:ml-[240px]">
      <DesktopSidebar />
      <header className="bg-surface/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-outline-variant/20">
        <div className="flex items-center justify-between px-gutter h-16 max-w-container-max mx-auto">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface flex-1 text-center pr-10">Referrals</h1>
        </div>
      </header>
      <main className="px-gutter max-w-[500px] mx-auto pt-6">
        <div className="bg-gradient-to-br from-primary to-tertiary rounded-[24px] p-6 text-on-primary relative overflow-hidden shadow-xl mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8" />
          <div className="relative z-10">
            <h2 className="font-headline-lg text-headline-lg font-bold mb-1">Invite Friends, Earn KSh 50</h2>
            <p className="font-body-md text-on-primary/80 mb-4">Share your code. When they pay, you both win!</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-label-sm text-on-primary/70">Your Referral Code</p>
                <p className="font-headline-xl text-headline-xl font-bold tracking-[0.2em]">{referralCode}</p>
              </div>
              <button onClick={handleCopy}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[20px]">{copied ? 'check' : 'content_copy'}</span>
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: 'people', value: referralStats.total, label: 'Total Invites', color: 'text-primary' },
            { icon: 'hourglass_empty', value: referralStats.pending, label: 'Pending', color: 'text-[#FF9800]' },
            { icon: 'check_circle', value: referralStats.completed, label: 'Completed', color: 'text-[#4CAF50]' },
            { icon: 'payments', value: `KSh ${referralStats.earnings}`, label: 'Earned', color: 'text-primary' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm text-center">
              <span className={`material-symbols-outlined text-[24px] ${stat.color} mb-1 block`} style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
              <p className="font-headline-sm text-headline-sm font-bold text-on-surface">{stat.value}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3 mb-6">
          <button onClick={handleShare}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-tertiary text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>share</span>Share Referral Link
          </button>
          <button onClick={() => {
            navigator.clipboard.writeText(referralLink).then(() => show('Link copied!', 'success'))
          }} className="w-full h-14 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2 border border-outline-variant/30">
            <span className="material-symbols-outlined text-[20px]">link</span>Copy Referral Link
          </button>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm mb-6">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>How it Works
          </h3>
          <div className="space-y-4">
            {[
              { icon: 'share', title: 'Share Your Code', desc: 'Send your unique referral code to friends' },
              { icon: 'person_add', title: 'Friends Join', desc: 'They sign up and pay the membership fee' },
              { icon: 'payments', title: 'You Earn', desc: 'Get KSh 50 for each successful referral' },
              { icon: 'account_balance_wallet', title: 'Cash Out', desc: 'Withdraw to M-Pesa anytime (min KSh 500)' },
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-primary">{step.icon}</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-medium">{step.title}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-3">Recent Referrals</h3>
        <div className="space-y-3">
          {[
            { name: 'James K.', date: '2 days ago', status: 'completed', amount: 'KSh 50' },
            { name: 'Mary W.', date: '1 week ago', status: 'completed', amount: 'KSh 50' },
            { name: 'David M.', date: '3 days ago', status: 'pending', amount: 'Pending' },
          ].map((referral, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-tertiary/20 flex items-center justify-center">
                <span className="font-headline-sm text-primary font-bold">{referral.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="font-label-md text-label-md text-on-surface font-medium">{referral.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{referral.date}</p>
              </div>
              <div className="text-right">
                <p className={`font-label-md text-label-md font-bold ${referral.status === 'completed' ? 'text-[#4CAF50]' : 'text-[#FF9800]'}`}>{referral.amount}</p>
                <span className={`font-label-xs text-label-xs px-2 py-0.5 rounded-full ${
                  referral.status === 'completed' ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'bg-[#FF9800]/10 text-[#FF9800]'
                }`}>{referral.status}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
