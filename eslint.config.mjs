import next from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/target/**",
      "frontend/**",
      "backend/**",
      "next.config.js",
      "postcss.config.js",
      "tailwind.config.js",
    ],
  },
  tseslint.configs.base,
  tseslint.configs.eslintRecommended,
  next.configs["core-web-vitals"],
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  {
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/prop-types": "off",
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
