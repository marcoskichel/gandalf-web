const app = {}

const getApps = jest.fn().mockReturnValue([app])
const getApp = jest.fn().mockReturnValue(app)
const initializeApp = jest.fn()

export { getApps, getApp, initializeApp }
