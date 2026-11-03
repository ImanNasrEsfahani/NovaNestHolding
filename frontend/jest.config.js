const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/services/(.*)$': '<rootDir>/services/$1',
    '^@/stores/(.*)$': '<rootDir>/stores/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^stores/(.*)$': '<rootDir>/stores/$1',
    '^app/i18n/(.*)$': '<rootDir>/app/i18n/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
