import { AppCollections } from '@config/firebase'
import { TokenGateAuthStatus } from '@models/TokenGate'
import {
  addDoc,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
} from 'firebase/firestore'

const findTokenGateAuthStatus = (
  id: string
): Promise<DocumentSnapshot<TokenGateAuthStatus>> => {
  const ref = doc(AppCollections.authStatuses, id)
  return getDoc(ref)
}

const setTokenGateAuthStatus = (
  data: TokenGateAuthStatus
): Promise<DocumentReference<TokenGateAuthStatus>> => {
  return addDoc<TokenGateAuthStatus>(AppCollections.authStatuses, data)
}

export { findTokenGateAuthStatus, setTokenGateAuthStatus }
