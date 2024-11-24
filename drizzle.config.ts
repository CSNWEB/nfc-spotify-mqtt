import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "./db/schema.js",
  dbCredentials: {
    url: "./tags.db",
  },
});
