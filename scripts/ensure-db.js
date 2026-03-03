/**
 * Ensure DATABASE_URL is set before Prisma commands run.
 * If the env var is missing, writes a .env file pointing to the bundled SQLite.
 * This file is used during the Infomaniak build step (GitHub deploy).
 */
const fs = require("node:fs");
const path = require("node:path");

const prismaDir = path.join(__dirname, "..", "prisma");
const dbPath = path.join(prismaDir, "dev.db");
const envFile = path.join(prismaDir, ".env");

if (process.env.DATABASE_URL) {
  console.log("[ensure-db] DATABASE_URL already set, skipping.");
  process.exit(0);
}

// Create prisma/.env so Prisma CLI picks it up
const url = `file:${dbPath}`;
fs.writeFileSync(envFile, `DATABASE_URL="${url}"\n`, "utf-8");
console.log(`[ensure-db] Wrote ${envFile} → ${url}`);

// Also create an empty SQLite file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, "");
  console.log(`[ensure-db] Created empty ${dbPath}`);
}
