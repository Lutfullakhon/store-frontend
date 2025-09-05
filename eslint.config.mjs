import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // Example: disallow console.logs in production
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Example: prefer const over let if not reassigned
      "prefer-const": "error",

      // Example: disallow anonymous default exports
      "import/no-anonymous-default-export": "error",
      "react-hooks/exhaustive-deps": 'off',
    },
  },
];

export default eslintConfig;
