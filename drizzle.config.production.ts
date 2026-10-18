import { defineConfig } from "drizzle-kit";

/**
 * Config used to push the schema to a REMOTE database (Neon, Supabase, ...).
 *
 * Usage:
 *   1. Put the remote connection string into your shell, e.g.:
 *        Windows (cmd):   set DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
 *        Windows (PS):    $env:DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
 *        Mac/Linux:       export DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
 *   2. Run:
 *        npx drizzle-kit push --config=drizzle.config.production.ts
 *
 * The local `drizzle.config.json` stays untouched for development.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
