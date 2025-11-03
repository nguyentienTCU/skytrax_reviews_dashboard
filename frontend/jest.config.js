// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/type(s)?/(.*)$': '<rootDir>/src/type$1/$2',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  "verbose": true,
  moduleDirectories: ['node_modules', '<rootDir>/src', '<rootDir>'],
};

module.exports = createJestConfig(customJestConfig);
