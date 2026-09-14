import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * vite.config.ts 와 분리한 이유:
 * 거기 붙은 tanstackRouter 플러그인이 테스트를 돌릴 때마다 routeTree.gen.ts 를
 * 재생성해 자동 생성 파일에 diff 를 남긴다. 테스트에는 필요 없는 플러그인이라 뺀다.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(process.cwd(), "src") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
