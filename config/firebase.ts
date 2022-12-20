// Import the functions you need from the SDKs you need
import firebaseConfig from '@constants/firebaseConfig'
import { OwnedTokenGate, TokenGateAuthStatus } from '@models/TokenGate'
import { FirebaseError, getApp, getApps, initializeApp } from 'firebase/app'
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
  try {
    connectAuthEmulator(auth, 'http://localhost:9099/')
    connectFirestoreEmulator(db, 'localhost', 8080)
  } catch (e) {
    const fbError = e as FirebaseError
    if (fbError.code !== 'failed-precondition') {
      throw fbError
    }
  }
}

auth.useDeviceLanguage()

const createCollection = <T = DocumentData>(collectionName: string) => {
  const col = collection(db, collectionName)
  return col as CollectionReference<T>
}

const AppCollections = {
  tokenGates: createCollection<OwnedTokenGate>('tokenGates'),
  authStatuses: createCollection<TokenGateAuthStatus>('authStatuses'),
}

export default app
export { db, auth, AppCollections }
