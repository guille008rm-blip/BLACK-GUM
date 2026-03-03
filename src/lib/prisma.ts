import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaReady?: boolean;
};

// ── Env validation (server-only) ────────────────────────────────
// Prisma needs DATABASE_URL. Fail fast with a clear message.
if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[prisma] DATABASE_URL is not set. Configure it in the hosting panel."
    );
  } else {
    console.warn("[prisma] DATABASE_URL is not set — queries will fail.");
  }
}

if (process.env.NODE_ENV === "production" && !globalForPrisma.prismaReady) {
  console.info("[prisma] ready");
  globalForPrisma.prismaReady = true;
}

// ── Singleton PrismaClient ──────────────────────────────────────
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ── Safe query helper ───────────────────────────────────────────
// Wraps a prisma query so it never crashes the request; returns fallback on error.
export async function safeQuery<T>(
  fn: () => Promise<T>,
  fallback: T,
  label = "query"
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[prisma] ${label} failed:`, error instanceof Error ? error.message : error);
    return fallback;
  }
}
