import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Settings() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { show } = useToast()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [location, setLocation] = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  const handleLogout = () => {
    logout()
    show('Logged out', 'success')
    navigate('/login')
  }

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen pb-24">
      <header className="bg-surface/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="flex items-center px-gutter h-16 max-w-container-max mx-auto">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface flex-1 text-center pr-10">Settings</h1>
        </div>
      </header>
      <main className="px-gutter max-w-[500px] mx-auto">
        <section className="py-6 border-b border-surface-variant">
          <h2 className="font-label-lg text-label-lg text-primary font-medium px-2 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span> Notifications
          </h2>
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm space-y-4">
            <ToggleSetting label="Push notifications" desc="Get notified about matches and messages" enabled={notifications} toggle={() => setNotifications(!notifications)} />
            <ToggleSetting label="Email notifications" desc="Receive updates via email" enabled={false} toggle={() => {}} />
          </div>
        </section>
        <section className="py-6 border-b border-surface-variant">
          <h2 className="font-label-lg text-label-lg text-primary font-medium px-2 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span> Privacy
          </h2>
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm space-y-4">
            <ToggleSetting label="Show location" desc="Display your general area to others" enabled={location} toggle={() => setLocation(!location)} />
            <ToggleSetting label="Online status" desc="Show when you're active" enabled={false} toggle={() => {}} />
          </div>
        </section>
        <section className="py-6 border-b border-surface-variant">
          <h2 className="font-label-lg text-label-lg text-primary font-medium px-2 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span> Appearance
          </h2>
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm space-y-4">
            <ToggleSetting label="Dark mode" desc="Use dark theme" enabled={darkMode} toggle={() => setDarkMode(!darkMode)} />
          </div>
        </section>
        <section className="py-6 border-b border-surface-variant">
          <h2 className="font-label-lg text-label-lg text-primary font-medium px-2 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span> Account
          </h2>
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm space-y-2">
            <MenuItem label="Edit profile" icon="edit" onClick={() => navigate('/edit-profile')} />
            <MenuItem label="Change password" icon="lock" onClick={() => navigate('/change-password')} />
            <MenuItem label="Blocked users" icon="block" onClick={() => navigate('/blocked-users')} />
            <MenuItem label="Help & Support" icon="help" onClick={() => navigate('/help')} />
          </div>
        </section>
        <section className="py-6">
          <button onClick={handleLogout}
            className="w-full h-12 rounded-xl border border-[#E53935]/30 text-[#E53935] font-label-md text-label-md hover:bg-[#E53935]/10 transition-colors flex items-center justify-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>logout</span> Log out
          </button>
          <button onClick={() => setShowDelete(true)}
            className="w-full h-12 rounded-xl text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors">
            Delete account
          </button>
        </section>
      </main>
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowDelete(false)}>
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-xl border border-outline-variant/20" onClick={e => e.stopPropagation()}>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Delete Account?</h3>
            <p className="text-on-surface-variant mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 h-12 rounded-xl bg-surface-container-high text-on-surface font-label-md">Cancel</button>
              <button onClick={() => { setShowDelete(false); show('Account deleted', 'info'); navigate('/login') }}
                className="flex-1 h-12 rounded-xl bg-[#E53935] text-white font-label-md">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ToggleSetting({ label, desc, enabled, toggle }) {
  return (
    <div className="flex items-center justify-between">
      <div><p className="font-body-md text-body-md text-on-surface">{label}</p>{desc && <p className="font-label-sm text-label-sm text-on-surface-variant">{desc}</p>}</div>
      <button onClick={toggle}
        className={`w-12 h-7 rounded-full transition-colors relative ${enabled ? 'bg-primary' : 'bg-surface-variant'}`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

function MenuItem({ label, icon, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center justify-between py-3 px-2 border-b border-surface-variant last:border-0 hover:bg-surface-container-high rounded-xl transition-colors">
      <span className="text-on-surface">{label}</span>
      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
    </button>
  )
}
