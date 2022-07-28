import type { Config } from '@jest/types'
require('dotenv').config()

const config: Config.InitialOptions = {
  verbose: true,
}
export default config

module.exports = {
  roots: ['<rootDir>/__test__'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/test/mocks'],
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '@entrypoint/(.*)': ['<rootDir>/src/entrypoint/$1'],
    '@models/(.*)': '<rootDir>/src/models/$1',
    '@helpers/(.*)': '<rootDir>/src/helpers/$1',
    '@exceptions/(.*)': '<rootDir>/src/exceptions/$1',
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
}
