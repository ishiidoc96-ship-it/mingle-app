import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'
import DesktopSidebar from '../components/DesktopSidebar'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('about')

  useEffect(() => {
    api.get('/users/profile/me').then(res => setProfile(res.data.user || res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const logoutHandler = () => { logout(); navigate('/login') }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
  if (!profile) return <div className="min-h-screen flex items-center justify-center text-on-surface-variant">Profile not found.</div>

  const stats = [
    { value: profile.successful || profile.totalReferrals || 0, label: 'Referrals', icon: 'group' },
    { value: `KSh ${(profile.totalEarned || profile.totalEarnings || 0).toLocaleString()}`, label: 'Earned', icon: 'payments' },
    { value: profile.likes_received || 0, label: 'Likes', icon: 'favorite' },
    { value: 0, label: 'Matches', icon: 'emoji_events' },
  ]

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen pb-24">
      <DesktopSidebar />
      <header className="bg-surface/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-outline-variant/20">
        <div className="flex items-center justify-between px-gutter h-16 max-w-container-max mx-auto">
          <h1 className="font-headline-md text-headline-md text-on-surface">My Profile</h1>
          <button onClick={() => navigate('/settings')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>
      <main className="max-w-container-max mx-auto px-gutter pt-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <Avatar name={profile.name} src={profile.avatar_url} size="xl" className="w-28 h-28" />
            <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full p-1.5 shadow-md">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
            </div>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">{profile.name}, {profile.age || '?'}</h1>
          <p className="font-body-md text-on-surface-variant flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-[18px]">location_on</span>{profile.location || 'Location not set'}
          </p>
          <div className="grid grid-cols-4 gap-4 mt-6 w-full max-w-md">
            {stats.map((s, i) => (
              <div key={i} className="bg-surface-container-low rounded-2xl p-3 text-center border border-outline-variant/30 shadow-sm">
                <span className="material-symbols-outlined text-[20px] text-primary mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                <p className="font-label-md text-label-md font-bold text-on-surface">{s.value}</p>
                <p className="font-label-xs text-label-xs text-on-surface-variant">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6 w-full max-w-md">
            <button onClick={() => navigate('/profile/edit')}
              className="flex-1 h-12 rounded-xl border border-primary text-primary font-label-md text-label-md hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">edit</span>Edit Profile
            </button>
            <button onClick={logoutHandler}
              className="flex-1 h-12 rounded-xl border border-[#E53935]/30 text-[#E53935] font-label-md text-label-md hover:bg-[#E53935]/10 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>logout</span>Log Out
            </button>
          </div>
          <div className="flex gap-2 mt-6 w-full max-w-md overflow-x-auto no-scrollbar">
            {['about', 'interests', 'prompts'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl font-label-sm text-label-sm capitalize transition-colors whitespace-nowrap ${
                  activeTab === tab ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="mt-6 w-full max-w-md">
          {activeTab === 'about' && (
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm space-y-4">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Bio</p>
                <p className="text-on-surface">{profile.bio || 'No bio added yet.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Job</p><p className="text-on-surface">{profile.occupation || 'Not set'}</p></div>
                <div><p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Education</p><p className="text-on-surface">{profile.education || 'Not set'}</p></div>
              </div>
              <div><p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Looking for</p><p className="text-on-surface">{profile.looking_for || 'Not specified'}</p></div>
            </div>
          )}
          {activeTab === 'interests' && (
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {(profile.interests || []).length === 0 ? <p className="text-on-surface-variant">No interests added.</p> :
                  profile.interests.map((interest, i) => (
                    <span key={i} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full font-label-sm text-label-sm">{interest}</span>
                  ))}
              </div>
            </div>
          )}
          {activeTab === 'prompts' && (
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm">
              <p className="text-on-surface-variant">No prompts answered yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
