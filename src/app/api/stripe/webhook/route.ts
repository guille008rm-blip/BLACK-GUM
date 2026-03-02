import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { BOOKING_STATUS } from "@/lib/booking";
import { appendBookingRow } from "@/lib/sheets";
import Stripe from "stripe";

// Ensure Next.js does NOT parse the body (Stripe needs raw bytes)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook handler.
 * IMPORTANT: This endpoint must receive the raw body to verify the signature.
 * Next.js App Router provides the raw body via request.text().
 */
export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: unknown) {
    console.error("[webhook] Signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: `Webhook signature verification failed` },
      { status: 400 }
    );
  }

  // ── Handle checkout.session.completed ─────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      console.warn("[webhook] No bookingId in session metadata");
      return NextResponse.json({ received: true });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { product: true, customer: true },
    });

    if (!booking) {
      console.error("[webhook] Booking not found:", bookingId);
      return NextResponse.json({ received: true });
    }

    // Idempotency: if already confirmed, just ack
    if (booking.status === BOOKING_STATUS.CONFIRMED) {
      return NextResponse.json({ received: true });
    }

    // Check if hold has expired
    if (
      booking.status === BOOKING_STATUS.HOLD &&
      booking.holdExpiresAt &&
      booking.holdExpiresAt < new Date()
    ) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BOOKING_STATUS.EXPIRED },
      });
      console.warn("[webhook] Hold expired, booking marked EXPIRED:", bookingId);
      // TODO: Issue refund via Stripe if payment was taken
      return NextResponse.json({ received: true });
    }

    // ── Confirm booking ────────────────────────────────────────
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BOOKING_STATUS.CONFIRMED,
        stripePaymentIntentId: paymentIntentId,
      },
    });

    console.log("[webhook] Booking confirmed:", bookingId);

    // ── Log to Google Sheets ───────────────────────────────────
    appendBookingRow({
      bookingId: booking.id,
      status: "CONFIRMED",
      productName: booking.product.name,
      mode: booking.mode,
      startAt: booking.startAt.toISOString(),
      endAt: booking.endAt.toISOString(),
      customerName: booking.customer?.fullName ?? "",
      email: booking.customer?.email ?? "",
      phone: booking.customer?.phone ?? "",
      priceTotalCents: booking.priceTotalCents,
      stripeSessionId: booking.stripeSessionId ?? "",
      stripePaymentIntentId: paymentIntentId ?? "",
      createdAt: booking.createdAt.toISOString(),
    }).catch(() => {});

    // TODO: Send confirmation email
  }

  return NextResponse.json({ received: true });
}
