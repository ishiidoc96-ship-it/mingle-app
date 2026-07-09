import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'

export default function Notifications() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data.notifications || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchNotifications(); const t = setInterval(fetchNotifications, 10000); return () => clearInterval(t) }, [])

  const markAllRead = async () => {
    try { await api.put('/notifications/read-all'); setNotifications(prev => prev.map(n => ({ ...n, read: true }))) } catch {}
  }

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen pb-24">
      <header className="bg-surface/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-outline-variant/20">
        <div className="flex items-center justify-between px-gutter h-16 max-w-container-max mx-auto">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-on-surface">Notifications</h1>
          </div>
          <button onClick={markAllRead} className="font-label-sm text-label-sm text-primary hover:text-tertiary transition-colors">Mark all read</button>
        </div>
      </header>
      <main className="px-gutter max-w-[500px] mx-auto">
        {loading ? <LoadingState type="list" count={5} /> : notifications.length === 0 ? (
          <EmptyState icon="notifications_off" title="No notifications" message="You're all caught up!" />
        ) : (
          <div className="space-y-2 mt-2">
            {notifications.map(n => (
              <div key={n.id} onClick={async () => {
                if (!n.read) { try { await api.put(`/notifications/${n.id}/read`); setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x)) } catch {} }
                if (n.type === 'match') navigate(`/chat/${n.data?.matchId}`)
              }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 ${
                  n.read ? 'bg-surface-container-lowest border-outline-variant/30' : 'bg-primary/5 border-primary/20'
                }`}>
                <div className="flex gap-3 items-start">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    n.read ? 'bg-surface-container-high text-on-surface-variant' : 'bg-primary/10 text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-[24px]" style={!n.read ? { fontVariationSettings: "'FILL' 1" } : {}}>
                      {n.type === 'match' ? 'favorite' : n.type === 'message' ? 'chat' : 'notifications'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md text-on-surface font-medium">{n.title}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{n.message}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant/60 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                  {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 flex-shrink-0" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
