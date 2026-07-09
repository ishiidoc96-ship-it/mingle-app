import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import BottomNav from '../components/BottomNav'
import DesktopSidebar from '../components/DesktopSidebar'
import Avatar from '../components/Avatar'

export default function DiscoverPeople() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [current, setCurrent] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [showCross, setShowCross] = useState(false)
  const [showStar, setShowStar] = useState(false)
  const [matchOverlay, setMatchOverlay] = useState(null)
  const cardRef = useRef(null)
  const startX = useRef(0)
  const startY = useRef(0)

  useEffect(() => {
    api.get('/users/discover').then(res => {
      setUsers(res.data.users || [])
    }).catch(() => {})
  }, [])

  const handleAction = useCallback(async (action) => {
    const target = users[current]
    if (!target) return
    if (action === 'like') {
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 600)
      try {
        const res = await api.post(`/users/${target.id}/swipe`, { action })
        if (res.data.match) {
          setMatchOverlay(target)
          setTimeout(() => setMatchOverlay(null), 3000)
        }
      } catch {}
    } else if (action === 'super_like') {
      setShowStar(true)
      setTimeout(() => setShowStar(false), 600)
      try {
        const res = await api.post(`/users/${target.id}/swipe`, { action: 'like' })
        if (res.data.match) {
          setMatchOverlay(target)
          setTimeout(() => setMatchOverlay(null), 3000)
        }
      } catch {}
    } else {
      setShowCross(true)
      setTimeout(() => setShowCross(false), 400)
      try { await api.post(`/users/${target.id}/swipe`, { action }) } catch {}
    }
    setTimeout(() => {
      setDragX(0)
      setDragY(0)
      if (current < users.length - 1) {
        setCurrent(c => c + 1)
      } else {
        setUsers([])
      }
    }, 300)
  }, [users, current])

  const handlePointerDown = (e) => {
    setIsDragging(true)
    startX.current = e.clientX || e.touches?.[0]?.clientX || 0
    startY.current = e.clientY || e.touches?.[0]?.clientY || 0
  }

  const handlePointerMove = (e) => {
    if (!isDragging) return
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0
    setDragX(clientX - startX.current)
    setDragY(clientY - startY.current)
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (dragX > 100) {
      handleAction('like')
    } else if (dragX < -100) {
      handleAction('pass')
    } else if (dragY < -100) {
      handleAction('super_like')
    } else {
      setDragX(0)
      setDragY(0)
    }
  }

  const rotate = dragX * 0.08
  const opacity = Math.max(0, 1 - Math.abs(dragX) / 500)
  const likeOpacity = Math.min(1, dragX / 150)
  const passOpacity = Math.min(1, -dragX / 150)

  const person = users[current]

  return (
    <>
    <DesktopSidebar />
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col overflow-hidden md:ml-[240px]">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm md:hidden">
        <div className="flex justify-between items-center px-gutter h-16 w-full max-w-container-max mx-auto">
          <button onClick={() => navigate('/home')} className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">Mingle</h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </header>
      <main className="flex-1 w-full max-w-[500px] mx-auto relative pt-16 pb-[100px] md:pt-md md:pb-md flex flex-col justify-center px-gutter md:px-0 h-screen overflow-hidden">
        {person ? (
          <div ref={cardRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onTouchStart={handlePointerDown} onTouchMove={handlePointerMove} onTouchEnd={handlePointerUp}
            className="relative w-full h-[618px] max-h-[700px] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] bg-surface-container-highest overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
            style={{ transform: `translate(${dragX}px, ${dragY}px) rotate(${rotate}deg) scale(${isDragging ? 1.02 : opacity})`, transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            <div className="absolute inset-0 w-full h-full">
              <Avatar src={person.avatar_url} name={person.name} size={618} className="w-full h-full rounded-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
            <div className="absolute top-md left-md flex gap-base z-10">
              <div className="bg-primary-container/90 backdrop-blur-sm text-on-primary-container px-sm py-xs rounded-xl font-label-sm text-label-sm flex items-center gap-xs">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span> Verified
              </div>
              <div className="bg-surface/80 backdrop-blur-sm text-on-surface px-sm py-xs rounded-xl font-label-sm text-label-sm">Active recently</div>
            </div>
            <div className={`absolute top-8 left-8 -rotate-[20deg] z-20 pointer-events-none transition-opacity duration-200 ${likeOpacity > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="bg-[#4CAF50] text-white px-6 py-3 rounded-xl border-4 border-white shadow-2xl font-headline-md text-headline-md font-bold tracking-wider">LIKE</div>
            </div>
            <div className={`absolute top-8 right-8 rotate-[20deg] z-20 pointer-events-none transition-all duration-200 ${passOpacity > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="bg-[#E53935] text-white px-6 py-3 rounded-xl border-4 border-white shadow-2xl font-headline-md text-headline-md font-bold tracking-wider">NOPE</div>
            </div>
            {dragY < -80 && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-200 opacity-100">
                <div className="bg-[#FF9800] text-white px-6 py-3 rounded-xl border-4 border-white shadow-2xl font-headline-md text-headline-md font-bold tracking-wider">SUPER LIKE</div>
              </div>
            )}
            {showHeart && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <div className="heart-burst">
                  <span className="material-symbols-outlined text-[100px] text-primary drop-shadow-2xl" style={{ fontVariationSettings: "'FILL' 1", animation: 'heartPop 0.6s ease-out forwards' }}>favorite</span>
                </div>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="absolute w-3 h-3 rounded-full bg-primary"
                    style={{
                      animation: `heartParticle ${0.5 + Math.random() * 0.4}s ease-out ${i * 0.03}s forwards`,
                      transform: 'translate(0, 0)',
                      '--tx': `${Math.cos(i * Math.PI / 4) * (80 + Math.random() * 60)}px`,
                      '--ty': `${Math.sin(i * Math.PI / 4) * (80 + Math.random() * 60)}px`,
                    }} />
                ))}
              </div>
            )}
            {showCross && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <span className="material-symbols-outlined text-[80px] text-[#E53935] drop-shadow-2xl" style={{ animation: 'heartPop 0.4s ease-out forwards' }}>close</span>
              </div>
            )}
            {showStar && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <span className="material-symbols-outlined text-[100px] text-[#FF9800] drop-shadow-2xl" style={{ fontVariationSettings: "'FILL' 1", animation: 'heartPop 0.6s ease-out forwards' }}>star</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 w-full p-md bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white z-10">
              <div className="flex justify-between items-end mb-sm">
                <div>
                  <h2 className="font-headline-xl text-headline-xl text-white flex items-center gap-xs drop-shadow-md">
                    {person.name}, {person.age || '?'}
                  </h2>
                  <div className="flex items-center gap-xs text-white/90 font-body-md text-body-md mt-xs">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>location_on</span>
                    {person.location || 'Nearby'}
                  </div>
                </div>
                <button onClick={() => navigate(`/profile/${person.id}`)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>info</span>
                </button>
              </div>
              <p className="font-body-md text-body-md text-white/90 line-clamp-2 drop-shadow-sm">{person.bio || 'No bio yet'}</p>
              <div className="flex flex-wrap gap-base mt-sm">
                <span className="px-sm py-xs rounded-xl bg-white/20 backdrop-blur-sm font-label-sm text-label-sm border border-white/30">{person.gender || 'Member'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-lg animate-fade-in-up">
            <div className="w-24 h-24 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container mb-md">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No more profiles</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-md">Check back later for new people nearby.</p>
            <button onClick={() => { api.get('/users/discover').then(r => { setUsers(r.data.users || []); setCurrent(0) }) }}
              className="h-[52px] px-lg rounded-xl bg-gradient-to-b from-primary to-tertiary text-on-primary font-label-md text-label-md shadow-[0_10px_30px_rgba(216,27,96,0.2)] hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center gap-2">
              <span className="material-symbols-outlined">refresh</span> Refresh
            </button>
          </div>
        )}
        {person && (
          <div className="absolute bottom-[110px] md:bottom-lg left-0 w-full flex justify-center items-center gap-md z-20 px-gutter">
            <button onClick={() => handleAction('pass')}
              className="w-16 h-16 rounded-full bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#E53935] hover:scale-110 hover:bg-surface-container-high active:scale-90 transition-all duration-200">
              <span className="material-symbols-outlined" style={{ fontSize: 32 }}>close</span>
            </button>
            <button onClick={() => handleAction('super_like')}
              className="w-12 h-12 rounded-full bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-secondary-container hover:scale-110 hover:bg-surface-container-high active:scale-90 transition-all duration-200">
              <span className="material-symbols-outlined" style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>star</span>
            </button>
            <button onClick={() => handleAction('like')}
              className="w-16 h-16 rounded-full bg-gradient-to-t from-tertiary to-primary-container shadow-[0_10px_30px_rgba(216,27,96,0.2)] flex items-center justify-center text-on-primary hover:scale-110 active:scale-90 transition-all duration-200">
              <span className="material-symbols-outlined" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </button>
          </div>
        )}
        {matchOverlay && (
          <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center pointer-events-none animate-fade-in">
            <div className="text-center">
              <div className="flex items-center justify-center -space-x-6 mb-lg">
                <div className="w-24 h-24 rounded-full border-4 border-primary shadow-xl animate-bounce overflow-hidden">
                  <Avatar src={matchOverlay.avatar_url} name={matchOverlay.name} size={92} className="w-full h-full" />
                </div>
                <div className="w-24 h-24 rounded-full border-4 border-tertiary bg-surface-container-high flex items-center justify-center shadow-xl animate-bounce" style={{ animationDelay: '0.2s' }}>
                  <span className="material-symbols-outlined text-4xl text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </div>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-white font-bold mb-2">It's a Match!</h2>
              <p className="font-body-lg text-body-lg text-white/80">You and {matchOverlay.name} liked each other</p>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
      <style>{`
        @keyframes heartPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes heartParticle {
          0% { transform: translate(0, 0) scale(0); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
    </>
  )
}
