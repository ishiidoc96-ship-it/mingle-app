import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import BottomNav from '../components/BottomNav'
import DesktopSidebar from '../components/DesktopSidebar'
import Avatar from '../components/Avatar'

export default function ChatList() {
  const navigate = useNavigate()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const polling = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/chats')
        setChats(res.data.chats)
      } catch {} finally { setLoading(false) }
    }
    load()
    polling.current = setInterval(load, 5000)
    return () => clearInterval(polling.current)
  }, [])

  const filtered = chats.filter(c =>
    !search || c.other_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
    <DesktopSidebar />
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen pb-24 md:pb-0 md:ml-[240px]">
      <header className="bg-surface/80 backdrop-blur-md shadow-sm fixed top-0 w-full z-50">
        <div className="flex justify-between items-center px-gutter h-16 max-w-container-max mx-auto">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">Chats</h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
      </header>
      <main className="pt-20 px-gutter max-w-container-max mx-auto">
        <div className="relative mb-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl text-on-surface font-body-md placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Search conversations..." />
        </div>
        {loading ? <LoadingState type="list" count={5} /> : filtered.length === 0 ? (
          <EmptyState icon="chat_bubble" title="No chats yet"
            message="When you match with someone, your conversations will appear here."
            action={{ icon: "explore", label: "Discover People", onClick: () => navigate('/discover') }} />
        ) : (
          <div className="space-y-1">
            {filtered.map(chat => (
              <button key={chat.id} onClick={() => navigate(`/chats/${chat.id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-colors active:scale-[0.99] text-left">
                <Avatar src={chat.other_avatar} name={chat.other_name} size={56} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-label-md text-label-md text-on-surface font-medium truncate">{chat.other_name || 'User'}</h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant/60 text-xs">
                      {chat.last_message_at ? new Date(chat.last_message_at + 'Z').toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant truncate text-sm mt-0.5">{chat.last_message || 'Start a conversation'}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
    </>
  )
}
