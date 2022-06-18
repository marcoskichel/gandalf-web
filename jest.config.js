const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    "@components/(.*)": "<rootDir>/components/$1",
    "@config/(.*)": "<rootDir>/config/$1",
    "@constants/(.*)": "<rootDir>/constants/$1",
    "@containers/(.*)": "<rootDir>/containers/$1",
    "@contexts/(.*)": "<rootDir>/contexts/$1",
    "@helpers/(.*)": "<rootDir>/helpers/$1"
  },
}

const getConfig = createJestConfig(config)

module.exports = async () => {
  const nextJestConfig = await getConfig()
  const transformIgnorePatterns = [
    '/node_modules/(?!firebase/*|@firebase/*)',
    ...nextJestConfig.transformIgnorePatterns.filter(
      (pattern) => pattern !== '/node_modules/'
    )
  ]
  return {...nextJestConfig, transformIgnorePatterns}
}
