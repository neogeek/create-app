/** @type {import('jest').Config} */
const jestConfig = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/dotenv.config.cjs'],
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['src/env.d.ts', 'src/utils/env.ts'],
};

export default jestConfig;
