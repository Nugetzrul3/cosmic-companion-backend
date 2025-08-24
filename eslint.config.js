const eslintPluginTs = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const importPlugin = require("eslint-plugin-import");

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
                sourceType: "module",
            },
            ecmaVersion: "latest",
        },
        plugins: {
            "@typescript-eslint": eslintPluginTs,
            import: importPlugin,
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_|^args" }],
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
];