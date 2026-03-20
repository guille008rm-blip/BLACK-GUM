import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import PremiumRentalCards from "@/components/rentals/PremiumRentalCards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alquiler de Equipos | Seleccion Curada",
  description:
    "Alquiler de equipos premium para producciones, con coordinacion clara y soporte tecnico."
};

const valuePoints = [
  "Equipamiento premium",
  "Kits listos para rodaje",
  "Coordinacion flexible",
  "Soporte tecnico"
];

const rentalSteps = [
  {
    id: "01",
    title: "Comparte fechas y necesidades",
    description: "Nos cuentas el plan de rodaje y el equipo que buscas."
  },
  {
    id: "02",
    title: "Confirmamos disponibilidad",
    description: "Validamos agenda y cerramos la configuracion adecuada."
  },
  {
    id: "03",
    title: "Recogida y devolucion",
    description: "Coordinamos la entrega del kit y el retorno tras produccion."
  }
];

export default function RentalsPage() {
  return (
    <div className="w-full">
      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="space-y-8">
            <div className="text-center space-y-6">
              <Badge variant="primary">Alquiler de Equipos Curados</Badge>
              <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight text-bone">
                Equipos Premium
                <span className="text-ember"> para Rodajes Reales</span>
              </h1>
              <p className="text-lg text-fog max-w-3xl mx-auto leading-relaxed">
                Seleccion enfocada de monitorado y video inalambrico para producciones
                que necesitan fiabilidad y coordinacion.
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <LinkButton href="#rentals-selection" variant="primary" size="md">
                  Ver equipos
                </LinkButton>
                <LinkButton
                  href="/contact?projectType=Coordinacion%20de%20alquiler&projectSummary=Necesito%20ayuda%20con%20un%20setup%20de%20alquiler.&budget=Presupuesto%20a%20medida"
                  variant="secondary"
                  size="md"
                >
                  Solicitar coordinacion
                </LinkButton>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-ink/85 to-ink/60 p-4 md:p-5">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {valuePoints.map((item) => (
                  <p
                    key={item}
                    className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-fog text-center"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section
        spacing="lg"
        id="rentals-selection"
        variant="gradient_warm"
        className="home-rentals-surface"
      >
        <Container maxWidth="xl">
          <div className="max-w-3xl mb-10 space-y-3">
            <Badge variant="secondary">Seleccion Curada</Badge>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-bone">
              Herramientas esenciales para produccion
            </h2>
            <p className="text-lg text-fog leading-relaxed">
              Una oferta compacta y profesional, pensada para cubrir necesidades clave en set.
            </p>
          </div>
          <PremiumRentalCards />
        </Container>
      </Section>

      <Section spacing="md" variant="dark">
        <Container maxWidth="lg">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <Badge variant="secondary">Como funciona</Badge>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-bone">
                Proceso simple y claro
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {rentalSteps.map((step) => (
                <div
                  key={step.id}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-ink/80 to-ink/65 p-5 space-y-2"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-ember font-semibold">
                    Paso {step.id}
                  </p>
                  <h3 className="text-xl font-display font-bold text-bone">{step.title}</h3>
                  <p className="text-sm text-fog leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center space-y-4">
              <h3 className="text-2xl font-display font-bold text-bone">
                Necesitas una configuracion concreta?
              </h3>
              <p className="text-fog max-w-2xl mx-auto">
                Si tu produccion requiere otro setup, te ayudamos a coordinar una solucion a medida.
              </p>
              <LinkButton href="/contact" variant="primary" size="md">
                Solicitar presupuesto a medida
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
