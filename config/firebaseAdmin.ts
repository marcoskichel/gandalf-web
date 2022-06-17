import firebaseAdmin from 'firebase-admin'
import firebaseConfig from '../constants/firebaseConfig'

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp(firebaseConfig)
}

export default firebaseAdmin
