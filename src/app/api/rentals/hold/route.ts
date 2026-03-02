import { NextRequest, NextResponse } from "next/server";
import type { BookingMode } from "@/lib/booking";
import {
  resolveProduct,
  normalizeDates,
  validateDuration,
  findConflicts,
  computePrice,
  createHold,
} from "@/lib/booking";
import { getStripe } from "@/lib/stripe";
import { appendBookingRow } from "@/lib/sheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      productId,
      start,
      end,
      mode: modeParam,
      customer,
      notes,
    } = body as {
      slug?: string;
      productId?: string;
      start: string;
      end: string;
      mode: string;
      customer: { fullName: string; email: string; phone: string };
      notes?: string;
    };

    // ── Validate inputs ──────────────────────────────────────────
    const slugOrId = slug || productId;
    if (!slugOrId || !start || !end || !modeParam) {
      return NextResponse.json(
        { error: "Faltan parámetros obligatorios" },
        { status: 400 }
      );
    }

    if (!["hourly", "daily"].includes(modeParam)) {
      return NextResponse.json(
        { error: "mode debe ser 'hourly' o 'daily'" },
        { status: 400 }
      );
    }

    if (!customer?.fullName || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { error: "Datos del cliente incompletos (fullName, email, phone)" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      return NextResponse.json(
        { error: "Email no válido" },
        { status: 400 }
      );
    }

    const product = await resolveProduct(slugOrId);
    if (!product || !product.active) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const mode = modeParam as BookingMode;
    const { startAt, endAt } = normalizeDates(mode, start, end);

    const durationError = validateDuration(mode, startAt, endAt);
    if (durationError) {
      return NextResponse.json({ error: durationError }, { status: 400 });
    }

    // Pre-check conflicts before transaction
    const preConflicts = await findConflicts(product.id, startAt, endAt);
    if (preConflicts.length > 0) {
      return NextResponse.json(
        { error: "No disponible en las fechas seleccionadas", conflicts: preConflicts },
        { status: 409 }
      );
    }

    const priceTotalCents = computePrice(mode, startAt, endAt);

    // ── Create HOLD in transaction ───────────────────────────────
    let booking;
    try {
      booking = await createHold({
        productId: product.id,
        startAt,
        endAt,
        mode,
        priceTotalCents,
        customer,
        notes,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "CONFLICT") {
        return NextResponse.json(
          { error: "No disponible — otro usuario acaba de reservar este horario" },
          { status: 409 }
        );
      }
      throw err;
    }

    // ── Create Stripe Checkout Session ───────────────────────────
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://blackgum.studio";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Alquiler: ${product.name}`,
              description: `${mode === "hourly" ? "Por horas" : "Por días"} — ${startAt.toLocaleDateString("es-ES", { timeZone: "Europe/Madrid" })} → ${endAt.toLocaleDateString("es-ES", { timeZone: "Europe/Madrid" })}`,
            },
            unit_amount: priceTotalCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        productId: product.id,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        mode,
      },
      customer_email: customer.email,
      success_url: `${baseUrl}/reserva/ok?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/rentals`,
      expires_at: Math.floor(Date.now() / 1000) + 15 * 60, // 15 min
    });

    // Store stripeSessionId on booking
    const { prisma } = await import("@/lib/prisma");
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id },
    });

    // ── Optional: log HOLD to Google Sheets ──────────────────────
    appendBookingRow({
      bookingId: booking.id,
      status: "HOLD",
      productName: product.name,
      mode,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      customerName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      priceTotalCents,
      stripeSessionId: session.id,
      stripePaymentIntentId: "",
      createdAt: new Date().toISOString(),
    }).catch(() => {}); // fire-and-forget

    return NextResponse.json({
      bookingId: booking.id,
      checkoutUrl: session.url,
    });
  } catch (err) {
    console.error("[hold]", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
