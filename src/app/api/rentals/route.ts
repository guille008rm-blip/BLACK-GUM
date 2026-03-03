import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const CATEGORIES = ["camera", "lens", "audio", "lighting", "grip", "other"];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    const where: Prisma.RentalItemWhereInput = {
      isActive: true
    };

    if (category && CATEGORIES.includes(category)) {
      where.category = category;
    }

    const rentals = await prisma.rentalItem.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(rentals);
  } catch (error) {
    console.error("[api/rentals] GET failed:", error instanceof Error ? error.message : error);
    return NextResponse.json([], { status: 200 });
  }
}
