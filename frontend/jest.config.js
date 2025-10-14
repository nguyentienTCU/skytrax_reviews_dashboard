// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/type/(.*)$": "<rootDir>/type/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]
};