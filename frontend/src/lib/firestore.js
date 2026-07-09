import { db } from './firebase'
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore'

const PHOTOS_COLLECTION = 'profile_photos'

export async function getPhotoUrl(userId) {
  try {
    const snap = await getDoc(doc(db, PHOTOS_COLLECTION, userId))
    if (snap.exists()) return snap.data().url
  } catch {}
  return null
}

export async function setPhotoUrl(userId, url) {
  try {
    await setDoc(doc(db, PHOTOS_COLLECTION, userId), { userId, url, updatedAt: new Date().toISOString() })
    return true
  } catch { return false }
}

export async function syncAllPhotos(mapping) {
  let count = 0
  for (const [key, url] of Object.entries(mapping)) {
    if (url) {
      const userId = key.replace(/\.jpg$/, '')
      try {
        await setDoc(doc(db, PHOTOS_COLLECTION, `seed_${userId}`), { userId: `seed_${userId}`, url, updatedAt: new Date().toISOString() })
        count++
      } catch {}
    }
  }
  return count
}
