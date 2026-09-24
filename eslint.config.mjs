import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The motion modules are lifted verbatim from the design prototype; their unused
    // parameters are intentional hooks (phScene(g, ctx), catch (e)).
    files: ["src/motion/**/*.js"],
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The design handoff is reference material, not app code.
    "design_handoff_*/**",
    "qa/__screens__/**",
    // One-off QA probes (gitignored); only the reusable harness is linted.
    "qa/review-*",
    "qa/fix-*",
  ]),
]);

export default eslintConfig;
