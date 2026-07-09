import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'

const CLOUD_NAME = 'dilrcexxe'
const UPLOAD_PRESET = 'MingleKe'

export default function ProfileSetup() {
  const navigate = useNavigate()
  const { updateProfile } = useAuth()
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [form, setForm] = useState({ name: '', age: '', gender: '', interestedIn: '', location: '', bio: '' })
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
      if (data.secure_url) setAvatarUrl(data.secure_url)
    } catch {} finally { setUploading(false) }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.age || !form.gender || !form.interestedIn || !form.location) return
    setLoading(true)
    try {
      await updateProfile({
        name: form.name,
        age: parseInt(form.age),
        gender: form.gender,
        interestedIn: form.interestedIn,
        location: form.location,
        bio: form.bio,
        avatarUrl: avatarUrl || undefined
      })
      navigate('/home', { replace: true })
    } catch {} finally { setLoading(false) }
  }

  return (
    <div className="text-on-background font-body-md antialiased overflow-x-hidden pb-32 min-h-screen"
      style={{ background: 'linear-gradient(135deg, #f9f9f9 0%, #fff2f3 100%)' }}>
      <header className="w-full px-gutter h-16 flex items-center justify-between max-w-container-max mx-auto pt-safe">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-headline-md text-headline-md text-primary font-bold">Mingle</span>
        <div className="w-10"></div>
      </header>
      <main className="max-w-md mx-auto px-gutter pt-lg pb-xl">
        <div className="flex items-center gap-2 mb-lg">
          <div className="h-1 flex-1 bg-primary rounded-full"></div>
          <div className="h-1 flex-1 bg-surface-variant rounded-full"></div>
          <div className="h-1 flex-1 bg-surface-variant rounded-full"></div>
        </div>
        <div className="text-center mb-10">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-2">Complete Your Profile</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Let's make sure others can find you.</p>
        </div>
        <div className="flex justify-center mb-10">
          <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-[0_10px_30px_rgba(216,27,96,0.15)] border-4 border-surface">
              <Avatar src={avatarUrl} name={form.name || 'You'} size={120} className="w-full h-full" />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary-container text-on-primary-container rounded-full shadow-lg flex items-center justify-center border-2 border-surface hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {uploading ? 'hourglass_top' : 'add'}
              </span>
            </button>
          </div>
        </div>
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSubmit() }}>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="name">Name</label>
            <input id="name" type="text" value={form.name} onChange={update('name')} required
              className="w-full bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none transition-colors focus:border-primary placeholder:text-outline/60 shadow-sm"
              placeholder="First Name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="age">Age</label>
              <input id="age" type="number" value={form.age} onChange={update('age')} min="18" max="120" required
                className="w-full bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none transition-colors focus:border-primary placeholder:text-outline/60 shadow-sm"
                placeholder="18+" />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="gender">Gender</label>
              <div className="relative">
                <select id="gender" value={form.gender} onChange={update('gender')} required
                  className="w-full appearance-none bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none transition-colors focus:border-primary shadow-sm">
                  <option value="" disabled>Select...</option>
                  <option value="woman">Woman</option>
                  <option value="man">Man</option>
                  <option value="nonbinary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">expand_more</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="interested">Interested In</label>
            <div className="relative">
              <select id="interested" value={form.interestedIn} onChange={update('interestedIn')} required
                className="w-full appearance-none bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none transition-colors focus:border-primary shadow-sm">
                <option value="" disabled>Select preferences...</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="everyone">Everyone</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">expand_more</span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="location">Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-primary">
                <span className="material-symbols-outlined text-xl">location_on</span>
              </div>
              <input id="location" type="text" value={form.location} onChange={update('location')} required
                className="w-full bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md text-body-md rounded-xl pl-11 pr-4 py-3 outline-none transition-colors focus:border-primary placeholder:text-outline/60 shadow-sm"
                placeholder="City, Country" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="bio">Bio <span className="text-outline/60 font-normal">(Optional)</span></label>
            <textarea id="bio" value={form.bio} onChange={update('bio')} rows="4"
              className="w-full bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 outline-none transition-colors focus:border-primary placeholder:text-outline/60 shadow-sm resize-none"
              placeholder="A little bit about yourself..."></textarea>
          </div>
          <div className="fixed bottom-0 left-0 w-full p-gutter glass-panel z-50 pb-safe md:static md:bg-transparent md:backdrop-blur-none md:border-none md:p-0 md:mt-10">
            <div className="max-w-md mx-auto">
              <button type="submit" disabled={loading}
                className="w-full h-14 bg-gradient-to-b from-primary-container to-tertiary text-on-primary-container rounded-xl font-label-md text-label-md shadow-[0_10px_30px_rgba(216,27,96,0.2)] hover:opacity-95 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Saving...' : 'Finish Setup'}
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
