module.exports = {
  verbose: true,
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
    },
  },
};

