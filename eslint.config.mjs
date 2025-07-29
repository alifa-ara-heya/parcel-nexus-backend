// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended, // Base JavaScript rules
  tseslint.configs.strict, // Strict TypeScript rules
  tseslint.configs.stylistic, // Style-focused rules
  {
    rules: {
      "no-console": "warn", // Warn on console.log (but allow for debugging)
      // Add more custom rules here if needed
    },
  }
);
