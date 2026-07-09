import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import DesktopSidebar from '../components/DesktopSidebar'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import Avatar from '../components/Avatar'

const stories = [
  { id: 1, name: 'Nairobi', img: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=200' },
  { id: 2, name: 'Mombasa', img: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7c?w=200' },
  { id: 3, name: 'Kisumu', img: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=200' },
  { id: 4, name: 'Nakuru', img: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd659e0?w=200' },
  { id: 5, name: 'Eldoret', img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=200' },
]

export default function HomeFeed() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    api.get('/search').then(res => { setUsers(res.data.users || []) }).catch(() => {}).finally(() => setLoading(false))
    setTimeout(() => setShowWelcome(false), 5000)
  }, [])

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen pb-24">
      <DesktopSidebar />
      <header className="bg-surface/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-outline-variant/20">
        <div className="flex items-center justify-between px-gutter h-16 max-w-container-max mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-primary font-headline-md text-headline-md font-bold tracking-wide">mingle</span>
            <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => navigate('/notifications')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant relative">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
            </button>
            <button onClick={() => navigate('/search')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[24px]">search</span>
            </button>
          </div>
        </div>
      </header>
      {showWelcome && (
        <div className="bg-gradient-to-r from-primary/10 to-tertiary/10 px-gutter py-3 border-b border-primary/20 animate-slide-down">
          <p className="text-on-surface font-label-sm text-label-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">celebration</span>
            Welcome to Mingle! Swipe, match, and connect with new people.
          </p>
        </div>
      )}
      <div className="flex gap-3 px-gutter py-4 overflow-x-auto no-scrollbar max-w-container-max mx-auto">
        {stories.map(story => (
          <button key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-tertiary p-0.5">
              <div className="w-full h-full rounded-full bg-surface p-0.5">
                <img src={story.img} alt={story.name} className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            <span className="font-label-xs text-label-xs text-on-surface-variant">{story.name}</span>
          </button>
        ))}
      </div>
      <main className="px-gutter max-w-container-max mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
          {loading ? <LoadingState type="card" count={6} /> : users.length === 0 ? (
            <EmptyState icon="group" title="No people yet" message="Check back soon for new members!" className="col-span-full" />
          ) : users.map(user => (
            <button key={user.id} onClick={() => navigate(`/profile/${user.id}`)}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:-translate-y-1 transition-transform duration-200 text-left group relative">
              <div className="h-48 bg-gradient-to-br from-primary-container/10 to-tertiary/10 flex items-center justify-center overflow-hidden">
                <Avatar name={user.name} src={user.avatar_url} size="lg" className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-label-md text-label-md text-on-surface font-medium">{user.name}{user.age ? `, ${user.age}` : ''}</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>{user.location || 'Nearby'}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(user.interests || []).slice(0, 3).map((interest, i) => (
                    <span key={i} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-label-xs text-label-xs">{interest}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-surface via-surface/95 to-transparent pt-8 pb-safe pointer-events-none">
        <div className="max-w-[500px] mx-auto pointer-events-auto">
          <div className="flex justify-around items-center h-16 bg-surface-container-lowest mx-4 rounded-full shadow-lg border border-outline-variant/30">
            <NavItem icon="explore" label="Discover" active onClick={() => navigate('/')} />
            <NavItem icon="chat_bubbles" label="Chats" onClick={() => navigate('/chats')} />
            <div className="relative -mt-6">
              <button onClick={() => navigate('/explore')}
                className="w-14 h-14 rounded-full bg-gradient-to-b from-primary to-tertiary text-on-primary flex items-center justify-center shadow-lg hover:opacity-90 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </button>
            </div>
            <NavItem icon="attach_money" label="Earn" onClick={() => navigate('/earnings')} />
            <NavItem icon="person" label="Profile" onClick={() => navigate('/profile')} />
          </div>
        </div>
      </div>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 px-3 py-1 group transition-colors">
      <span className={`material-symbols-outlined text-[24px] transition-colors ${active ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}
        style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
      <span className={`font-label-xs text-label-xs transition-colors ${active ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>{label}</span>
    </button>
  )
}
