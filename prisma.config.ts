import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// O Next.js usa .env.local; carregamos ele aqui para a CLI do Prisma
// (migrate, db pull) enxergar as mesmas chaves.
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // A CLI do Prisma usa a conexão DIRETA (porta 5432).
    // O Client em runtime usa DATABASE_URL (pooled :6543) via driver adapter.
    url: env("DIRECT_URL"),
  },
});
