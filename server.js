const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const next = require("next");

// Load .env.production if present (Infomaniak deploy)
const envPath = path.join(__dirname, ".env.production");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex);
    let value = trimmed.slice(eqIndex + 1);
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
  console.log("> Loaded .env.production");
}

// Fallback: ensure DATABASE_URL points to the bundled SQLite file
if (!process.env.DATABASE_URL) {
  const dbFile = path.join(__dirname, "prisma", "dev.db");
  process.env.DATABASE_URL = `file:${dbFile}`;
  console.log(`> DATABASE_URL fallback set to file:${dbFile}`);
}

const port = Number.parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "0.0.0.0";

const app = next({
  dev: false,
  hostname: host,
  port,
});

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => handle(req, res))
      .listen(port, host, () => {
        console.log(`> Ready on http://${host}:${port}`);
      });
  })
  .catch((error) => {
    console.error("Failed to start Next.js:", error);
    process.exit(1);
  });
