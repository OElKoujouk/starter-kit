import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        rules: {
            // TypeScript strict
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-floating-promises": "warn",

            // Code quality
            "no-console": "off", // Logger utilisé à la place
            eqeqeq: ["error", "always"],
            "prefer-const": "error",
            "no-duplicate-imports": "error",
        },
    },
    {
        ignores: ["dist/", "node_modules/", "prisma/"],
    }
);
