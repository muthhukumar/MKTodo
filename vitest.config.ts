import {defineConfig} from "vitest/config"
import react from "@vitejs/plugin-react"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsConfigPaths(), react()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
  },
})
