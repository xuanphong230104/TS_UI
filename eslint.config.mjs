import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.jest, ...globals.node } },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error"
    },
    settings: {
      "react": {
        "version": "detect"
      }
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
];