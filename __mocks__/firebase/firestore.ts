const getFirestore = jest.fn()
const addDoc = jest.fn()
const deleteDoc = jest.fn()
const doc = jest.fn()
const getDoc = jest.fn()
const getDocs = jest.fn()
const query = jest.fn()
const where = jest.fn()
const setDoc = jest.fn()
const collection = jest.fn().mockReturnValue({ withConverter: jest.fn() })

export {
  getFirestore,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  collection,
}
