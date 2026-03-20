import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import BookingConfirmation from "./BookingConfirmation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reserva Recibida",
  description: "Tu pago ha sido recibido. Estamos confirmando tu reserva.",
};

export default function ReservaOkPage() {
  return (
    <div className="w-full">
      <Section spacing="lg">
        <Container maxWidth="md">
          <Suspense
            fallback={
              <div className="text-center py-16">
                <p className="text-fog text-lg">Cargando…</p>
              </div>
            }
          >
            <BookingConfirmation />
          </Suspense>
        </Container>
      </Section>
    </div>
  );
}
