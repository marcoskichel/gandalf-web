// Import the functions you need from the SDKs you need
import firebaseConfig from '@constants/firebaseConfig'
import { OwnedTokenGate } from '@models/TokenGate'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import {
  collection,
  CollectionReference,
  connectFirestoreEmulator,
  DocumentData,
  getFirestore,
} from 'firebase/firestore'

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const auth = getAuth(app)

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectAuthEmulator(auth, 'http://localhost:9099/')
}

auth.useDeviceLanguage()

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>
}

const AppCollections = {
  tokenGates: createCollection<OwnedTokenGate>('tokenGates'),
}

export default app
export { db, auth, AppCollections }
