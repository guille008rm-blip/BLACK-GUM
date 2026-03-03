import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaEnvLogged?: boolean;
};

// Fail-fast: ensure DATABASE_URL is set before Prisma tries to connect
if (!process.env.DATABASE_URL) {
  // During next build, DATABASE_URL may legitimately be absent for static pages.
  // Only crash hard at runtime (i.e. when the server is actually handling requests).
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[prisma] DATABASE_URL environment variable is not set. " +
        "Set it in the Infomaniak panel or as a system env var before starting the app."
    );
  } else {
    console.warn("[prisma] DATABASE_URL is not set — Prisma queries will fail.");
  }
}

if (process.env.NODE_ENV === "production" && !globalForPrisma.prismaEnvLogged) {
  console.info("[prisma] DATABASE_URL present ✓");
  globalForPrisma.prismaEnvLogged = true;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
