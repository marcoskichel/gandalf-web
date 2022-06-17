import firebaseConfig from '@constants/firebaseConfig'
import firebaseAdmin from 'firebase-admin'

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp(firebaseConfig)
}

export default firebaseAdmin
