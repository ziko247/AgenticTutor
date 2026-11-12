import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:3000",
    headless: true,
    launchOptions: {
      executablePath: process.env.CHROME_PATH,
    },
  },
  workers: 1,
  reporter: "list",
});
