const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
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

module.exports = createJestConfig(customJestConfig)
