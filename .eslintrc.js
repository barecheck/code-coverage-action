module.exports = {
  env: {
    node: true,
    mocha: true
  },
  extends: [
    "airbnb-base",
    "prettier",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  plugins: ["prettier", "simple-import-sort"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    "prettier/prettier": "error",
    "no-console": 1,
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    // Code complexity rules
    complexity: ["error", 10],
    "max-depth": ["error", 3],
    "max-nested-callbacks": ["error", 3],
    "max-statements": ["error", 10],
    "max-lines": ["error", 300]
  },
  overrides: [
    // Code complexity rules for test files
    {
      files: ["*.test.js"],
      rules: {
        "max-depth": ["error", 2],
        "max-nested-callbacks": ["error", 4],
        "max-statements": ["error", 30],
        "max-lines": ["error", 500]
      }
    }
  ]
};
