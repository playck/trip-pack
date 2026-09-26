import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * vite.config.ts 와 분리한 이유:
 * 거기 붙은 tanstackRouter 플러그인이 테스트를 돌릴 때마다 routeTree.gen.ts 를
 * 재생성해 자동 생성 파일에 diff 를 남긴다.
 */
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(process.cwd(), "src") },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
