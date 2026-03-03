import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const posts = await prisma.post.findMany({
      where: { publishedAt: { not: null, lte: now } },
      orderBy: { publishedAt: "desc" }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("[api/blog] GET failed:", error instanceof Error ? error.message : error);
    return NextResponse.json([], { status: 200 });
  }
}
