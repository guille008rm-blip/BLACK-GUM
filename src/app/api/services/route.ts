import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("[api/services] GET failed:", error instanceof Error ? error.message : error);
    return NextResponse.json([], { status: 200 });
  }
}
