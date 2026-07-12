import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Avatar from '../components/Avatar'
import DesktopSidebar from '../components/DesktopSidebar'

const CLOUD_NAME = 'dilrcexxe'
const UPLOAD_PRESET = 'MingleKe'

export default function EditProfile() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const { show } = useToast()
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [form, setForm] = useState({
    name: user?.name || '', age: user?.age || '', gender: user?.gender || '',
    interestedIn: user?.interested_in || user?.interestedIn || '', location: user?.location || '', bio: user?.bio || ''
  })
  const [loading, setLoading] = useState(false)

  const update = field => e => setForm({ ...form, [field]: e.target.value })

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)
      formData.append('folder', 'mingle/profiles')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.secure_url) {
        setAvatarUrl(data.secure_url)
        show('Photo uploaded!', 'success')
      }
    } catch { show('Upload failed', 'error') } finally { setUploading(false) }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.age || !form.gender || !form.location) return
    setLoading(true)
    try {
      await updateProfile({
        name: form.name, age: parseInt(form.age), gender: form.gender,
        interestedIn: form.interestedIn, location: form.location, bio: form.bio,
        avatarUrl: avatarUrl || undefined
      })
      show('Profile updated!', 'success')
      navigate('/profile')
    } catch { show('Failed to update', 'error') } finally { setLoading(false) }
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md antialiased md:ml-[240px]">
      <DesktopSidebar />
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center px-gutter h-16 max-w-container-max mx-auto">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface flex-1 text-center pr-10">Edit Profile</h1>
        </div>
      </header>
      <main className="pt-20 px-gutter max-w-[500px] mx-auto pb-32">
        <div className="flex justify-center mb-lg">
          <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-[0_10px_30px_rgba(216,27,96,0.15)] border-4 border-surface">
              <Avatar src={avatarUrl} name={user?.name} size={104} className="w-full h-full" />
            </div>
            <div className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center border-2 border-surface">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {uploading ? 'hourglass_top' : 'camera_alt'}
              </span>
            </div>
          </div>
        </div>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSubmit() }}>
          <div><label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Name</label>
            <input type="text" value={form.name} onChange={update('name')} className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl px-4 py-3 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Age</label>
              <input type="number" value={form.age} onChange={update('age')} className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl px-4 py-3 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" /></div>
            <div><label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Gender</label>
              <select value={form.gender} onChange={update('gender')} className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl px-4 py-3 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option value="" disabled>Select</option>
                <option value="woman">Woman</option><option value="man">Man</option>
                <option value="nonbinary">Non-binary</option><option value="other">Other</option>
              </select></div>
          </div>
          <div><label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Interested In</label>
            <select value={form.interestedIn} onChange={update('interestedIn')} className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl px-4 py-3 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none">
              <option value="" disabled>Select</option>
              <option value="women">Women</option><option value="men">Men</option><option value="everyone">Everyone</option>
            </select></div>
          <div><label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Location</label>
            <input type="text" value={form.location} onChange={update('location')} className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl px-4 py-3 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" /></div>
          <div><label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Bio</label>
            <textarea rows="4" value={form.bio} onChange={update('bio')} className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl px-4 py-3 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" /></div>
          <button type="submit" disabled={loading}
            className="w-full h-[56px] rounded-xl bg-gradient-to-b from-primary to-tertiary text-on-primary font-label-md text-label-md shadow-[0_10px_30px_rgba(216,27,96,0.2)] hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  )
}
