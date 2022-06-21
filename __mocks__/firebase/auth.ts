const auth = {
  useDeviceLanguage: jest.fn(),
}

const user = { email: 'user@test.com', password: '12345' }

const getAuth = jest.fn().mockReturnValue(auth)
const connectAuthEmulator = jest.fn()
const createUserWithEmailAndPassword = jest.fn().mockResolvedValue({ user })
const signInWithEmailAndPassword = jest.fn().mockResolvedValue({ user })
const signInWithPopup = jest.fn().mockResolvedValue({ user })
const onIdTokenChanged = jest.fn()

const GoogleAuthProvider = jest.fn()

export {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onIdTokenChanged,
  GoogleAuthProvider,
}
