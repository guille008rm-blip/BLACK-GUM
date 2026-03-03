import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const packs = await prisma.pack.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
    });
    return NextResponse.json(packs);
  } catch (error) {
    console.error("[api/packs] GET failed:", error instanceof Error ? error.message : error);
    return NextResponse.json([], { status: 200 });
  }
}
