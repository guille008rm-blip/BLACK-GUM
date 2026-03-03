import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const rental = await prisma.rentalItem.findFirst({
      where: { slug: params.slug, isActive: true }
    });
    if (!rental) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(rental);
  } catch (error) {
    console.error("[api/rentals/slug] GET failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
