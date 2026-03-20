import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import BookingLookup from "./BookingLookup";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Estado de Reserva",
  description: "Consulta el estado de tu reserva de alquiler.",
};

export default function ReservaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="w-full">
      <Section spacing="lg">
        <Container maxWidth="md">
          <BookingLookup bookingId={params.id} />
        </Container>
      </Section>
    </div>
  );
}
