// Import the functions you need from the SDKs you need
import firebaseConfig from '@constants/firebaseConfig'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const auth = getAuth(app)

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectAuthEmulator(auth, 'http://localhost:9099/')
}

auth.useDeviceLanguage()

export default app
export { db, auth }
