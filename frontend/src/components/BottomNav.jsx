import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/home', icon: 'home', label: 'Home', fillIcon: true },
  { path: '/discover', icon: 'explore', label: 'Discover', fillIcon: false },
  { path: '/chats', icon: 'chat_bubble', label: 'Chats', fillIcon: false },
  { path: '/referrals', icon: 'account_balance_wallet', label: 'Referrals', fillIcon: false },
  { path: '/profile', icon: 'person', label: 'Profile', fillIcon: false },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/home') return location.pathname === '/home'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="md:hidden bg-surface/90 backdrop-blur-lg fixed bottom-0 w-full z-50 pb-safe border-t border-outline-variant/20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-20 w-full px-2">
        {tabs.map(tab => {
          const active = isActive(tab.path)
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center rounded-xl active:scale-90 transition-all duration-150 p-2 w-16 h-16 relative ${
                active ? 'text-primary font-bold' : 'text-on-surface-variant hover:bg-primary-container/5'
              }`}>
              <span className="material-symbols-outlined mb-1"
                style={active && tab.fillIcon ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {tab.icon}
              </span>
              <span className="font-label-sm text-label-sm">{tab.label}</span>
              {active && <div className="absolute bottom-1 w-5 h-[3px] rounded-full bg-primary" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
