import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import LoadingState from '../components/LoadingState'
import Avatar from '../components/Avatar'

export default function ProfileDetails() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [matched, setMatched] = useState(false)

  useEffect(() => {
    api.get(`/users/${userId || ''}/profile`).then(res => {
      setProfile(res.data.user || res.data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [userId])

  const handleLike = async () => {
    try {
      const res = await api.post(`/users/${profile.id}/swipe`, { action: 'like' })
      if (res.data.match) {
        setMatched(true)
      }
    } catch {}
  }

  if (loading) return <div className="bg-surface min-h-screen"><LoadingState /></div>
  if (!profile) return (
    <div className="bg-surface min-h-screen flex items-center justify-center">
      <p className="font-body-md text-body-md text-on-surface-variant">Profile not found</p>
    </div>
  )

  if (matched) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-tertiary/10 blur-[80px]" />
        </div>
        <main className="relative z-10 text-center px-gutter">
          <div className="flex items-center justify-center -space-x-8 mb-lg">
            <div className="w-28 h-28 rounded-full border-4 border-primary shadow-[0_10px_30px_rgba(216,27,96,0.3)] overflow-hidden">
              <Avatar src={profile.avatar_url} name={profile.name} size={104} className="w-full h-full" />
            </div>
            <div className="w-28 h-28 rounded-full border-4 border-tertiary shadow-[0_10px_30px_rgba(141,34,169,0.3)] bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-tertiary">person</span>
            </div>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">It's a Match!</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">You and {profile.name} liked each other.</p>
          <div className="flex flex-col gap-md max-w-xs mx-auto">
            <button onClick={() => { api.post('/chats/start', { userId: profile.id }).then(r => navigate(`/chats/${r.data.chat.id}`)) }}
              className="h-[56px] rounded-xl bg-gradient-to-b from-primary to-tertiary text-on-primary font-label-md text-label-md shadow-[0_10px_30px_rgba(216,27,96,0.2)] hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">chat</span> Send Message
            </button>
            <button onClick={() => navigate('/discover')}
              className="h-[56px] rounded-xl border-2 border-outline-variant/50 text-on-surface font-label-md text-label-md hover:bg-surface-container-high active:scale-95 transition-all duration-200">
              Keep Browsing
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm h-16 flex items-center px-gutter max-w-container-max mx-auto">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-md text-headline-md text-on-surface flex-1 text-center pr-10">Profile</h1>
      </header>
      <main className="pt-20 pb-24 px-gutter max-w-[600px] mx-auto">
        <div className="bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 mb-md">
          <div className="h-48 bg-gradient-to-br from-primary-container/20 to-tertiary/10 flex items-center justify-center relative overflow-hidden">
            <Avatar src={profile.avatar_url} name={profile.name} size={128} className="w-32 h-32 rounded-full border-4 border-surface shadow-[0_10px_30px_rgba(216,27,96,0.15)]" />
          </div>
          <div className="p-md text-center -mt-16 pt-0">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
              {profile.name}, {profile.age || '?'}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center justify-center gap-xs mt-xs">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              {profile.location || 'Nearby'}
            </p>
            {profile.gender && (
              <span className="inline-block mt-sm px-sm py-xs bg-primary-container/10 text-primary-container rounded-xl font-label-sm text-label-sm capitalize">{profile.gender}</span>
            )}
          </div>
        </div>
        {profile.bio && (
          <div className="bg-surface-container-lowest rounded-[24px] p-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 mb-md">
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm">About</h3>
            <p className="font-body-md text-body-md text-on-surface">{profile.bio}</p>
          </div>
        )}
        <div className="bg-surface-container-lowest rounded-[24px] p-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 mb-md">
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm">Details</h3>
          <div className="space-y-3">
            {profile.age && <div className="flex justify-between"><span className="font-body-md text-body-md text-on-surface-variant">Age</span><span className="font-body-md text-body-md text-on-surface font-medium">{profile.age}</span></div>}
            {profile.gender && <div className="flex justify-between"><span className="font-body-md text-body-md text-on-surface-variant">Gender</span><span className="font-body-md text-body-md text-on-surface font-medium capitalize">{profile.gender}</span></div>}
            {profile.location && <div className="flex justify-between"><span className="font-body-md text-body-md text-on-surface-variant">Location</span><span className="font-body-md text-body-md text-on-surface font-medium">{profile.location}</span></div>}
          </div>
        </div>
        <div className="flex gap-md">
          <button onClick={() => { api.post(`/users/${profile.id}/swipe`, { action: 'pass' }).then(() => navigate(-1)) }}
            className="flex-1 h-[56px] rounded-xl border-2 border-outline-variant/50 text-on-surface font-label-md text-label-md hover:bg-surface-container-high active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">close</span> Pass
          </button>
          <button onClick={handleLike}
            className="flex-1 h-[56px] rounded-xl bg-gradient-to-b from-primary to-tertiary text-on-primary font-label-md text-label-md shadow-[0_10px_30px_rgba(216,27,96,0.2)] hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span> Like
          </button>
        </div>
      </main>
    </div>
  )
}
