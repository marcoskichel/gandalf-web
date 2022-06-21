const router = { push: jest.fn() }
const useRouter = jest.fn().mockReturnValue(router)

export { useRouter }
