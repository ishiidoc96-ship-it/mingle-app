import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD6ZMd3-Vkx9Bcr9a1eEfJWdtbmK6_EAVs",
  authDomain: "obomocare.firebaseapp.com",
  projectId: "obomocare",
  storageBucket: "obomocare.firebasestorage.app",
  messagingSenderId: "816388688401",
  appId: "1:816388688401:web:721c812ddf5403081fbfb0",
  measurementId: "G-50LQ7DJLRM"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export default app
