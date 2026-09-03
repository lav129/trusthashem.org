import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://trusthashem.org",
  trailingSlash: "always",
  output: "static",
  build: {
    format: "directory",
  },
});
