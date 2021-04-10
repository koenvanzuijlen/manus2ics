module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es6: true,
    amd: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "prettier"],
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      extends: ["plugin:@typescript-eslint/recommended"],
    },
  ],
};
