const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
//  silent: true, // Hide console output of successful tests
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", "<rootDir>/mocks/jestMocks.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'jest-transform-stub',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^msw/node$': '<rootDir>/node_modules/msw/src/node',
  },
  setupFiles: ["dotenv/config"],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!ol|msw/)', // Añade aquí cualquier otro módulo que necesite ser transformado
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
