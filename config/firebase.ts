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
  FirestoreDataConverter,
  getFirestore,
  Timestamp,
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
  const col = collection(db, collectionName)
  return col as CollectionReference<T>
}

const tokenGateConverter: FirestoreDataConverter<OwnedTokenGate> = {
  toFirestore: (data) => data,
  fromFirestore: (snapshot) => {
    const data = snapshot.data() as OwnedTokenGate
    const endDateTime = data.endDateTime as Timestamp | null
    const startDateTime = data.startDateTime as Timestamp | null
    return {
      ...data,
      endDateTime: endDateTime?.toDate(),
      startDateTime: startDateTime?.toDate(),
    }
  },
}

const AppCollections = {
  tokenGates:
    createCollection<OwnedTokenGate>('tokenGates').withConverter(
      tokenGateConverter
    ),
}

export default app
export { db, auth, AppCollections }
