import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // 로컬: Supabase CLI가 띄운 Postgres (supabase/config.toml [db].port = 54322)
    url: process.env["DATABASE_URL"],
  },
});
