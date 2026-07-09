import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

const items = [
  { icon: 'home', label: 'Home', path: '/home', fillIcon: true },
  { icon: 'explore', label: 'Discover', path: '/discover' },
  { icon: 'chat_bubble', label: 'Chats', path: '/chats' },
  { icon: 'redeem', label: 'Referrals', path: '/referrals' },
  { icon: 'person', label: 'Profile', path: '/profile' },
]

export default function DesktopSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <nav className="hidden md:flex fixed top-0 left-0 h-full w-[240px] bg-surface border-r border-outline-variant/20 flex-col px-3 py-lg shadow-sm z-40">
      <div className="px-3 mb-xl">
        <div className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">Mingle</div>
        <p className="font-label-sm text-label-sm text-on-surface-variant/60 mt-0.5">Meet. Connect. Earn.</p>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        {items.map(item => {
          const active = item.path === '/home'
            ? location.pathname === '/home'
            : location.pathname.startsWith(item.path)
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-body-md text-body-md text-left ${
                active
                  ? 'text-on-primary bg-gradient-to-r from-primary to-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface active:scale-[0.98]'
              }`}>
              <span className="material-symbols-outlined text-[22px]" style={active || item.fillIcon ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              {item.label}
            </button>
          )
        })}
      </div>
      <div className="px-3 pt-md border-t border-outline-variant/20">
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatar_url} name={user?.name} size={36} />
          <div className="flex-1 min-w-0">
            <p className="font-label-sm text-label-sm text-on-surface truncate">{user?.name || 'User'}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant/60 text-xs truncate">{user?.email || 'user@mingle.app'}</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
