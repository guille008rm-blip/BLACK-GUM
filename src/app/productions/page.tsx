import Image from "next/image";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { LinkButton } from "@/components/ui/Button";
import ProcessScroll from "@/components/ProcessScroll";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Producción de Servicio Completo | Black Gum",
  description:
    "Servicios de producción premium para campañas, videoclips e historias cinematográficas. De concepto a entrega."
};

export default function ProductionsPage() {
  return (
    <div className="w-full">
      <Section spacing="lg" variant="dark">
        <Container maxWidth="xl">
          <div className="mb-12">
            <SectionTitle title="Nuestro proceso" center={true} />
          </div>

          <ProcessScroll />
        </Container>
      </Section>

      <Section spacing="lg">
        <Container maxWidth="xl">
          <div className="mb-12">
            <SectionTitle
              title="Qué producimos"
              subtitle="En todos los formatos y plataformas, convertimos visiones creativas en piezas con impacto."
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Campañas comerciales y de marca",
                description:
                  "Producción estratégica para marcas y agencias. Campañas para TV, digital y social con narrativa consistente."
              },
              {
                name: "Videoclips y contenido para artistas",
                description:
                  "Videoclips cinematográficos y contenido editorial para artistas, desde concepto hasta entrega final."
              },
              {
                name: "Cobertura corporativa y de eventos",
                description:
                  "Documentación profesional, cobertura en vivo y piezas corporativas con acabado cinematográfico."
              }
            ].map((type, idx) => (
              <Card key={idx} variant="solid" padding="lg">
                <div className="space-y-3">
                  <h3 className="font-display text-xl font-bold text-bone">
                    {type.name}
                  </h3>
                  <p className="text-fog text-sm leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" variant="dark">
        <Container maxWidth="lg">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-bone">
              ¿Por qué trabajar con Black Gum?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "Cultura de estudio boutique",
                text: "Equipos ágiles y especializados, enfocados en tu proyecto de principio a fin.",
                icon: "/images/icons/cultura-estudio-boutique.png"
              },
              {
                title: "Equipamiento de primera",
                text: "Kits profesionales de cámara, iluminación y audio con tecnología actualizada.",
                icon: "/images/icons/equipo-primera-categoria.png"
              },
              {
                title: "Liderazgo creativo",
                text: "Dirección y cinematografía senior guiando decisiones narrativas y visuales.",
                icon: "/images/icons/liderazgo-creativo.png"
              },
              {
                title: "Paquetes flexibles",
                text: "Desde producción integral hasta refuerzo de equipo específico, según alcance.",
                icon: "/images/icons/paquetes-flexibles.png"
              }
            ].map((item, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="relative w-[72px] h-[72px] rounded-full bg-gradient-to-r from-ember to-gum shadow-[0_0_22px_rgba(241,169,58,0.6)] flex items-center justify-center">
                      <div className="absolute inset-[1px] rounded-full bg-ember/15" />
                      <Image
                        src={item.icon}
                        alt=""
                        width={64}
                        height={64}
                        sizes="64px"
                        className="relative h-16 w-16 object-contain drop-shadow-[0_0_6px_rgba(241,169,58,0.6)]"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-bone">
                      {item.title}
                    </h3>
                    <p className="text-fog text-sm mt-2">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-bone">
                Cronograma y presupuesto
              </h2>
              <p className="text-lg text-fog leading-relaxed">
                Los tiempos y presupuestos varían según alcance. En proyectos comerciales,
                solemos trabajar en ciclos de 4 a 8 semanas desde preproducción hasta entrega.
              </p>
              <p className="text-lg text-fog leading-relaxed">
                Cuéntanos tu visión, entregables y calendario para definir el enfoque de producción adecuado.
              </p>
            </div>
            <Card variant="glass" padding="lg">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold mb-2">
                    Cronograma típico
                  </p>
                  <p className="text-bone font-display text-2xl">4-8 semanas</p>
                  <p className="text-fog text-sm mt-2">De preproducción a entrega</p>
                </div>
                <div className="border-t border-white/10 pt-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold mb-2">
                    Rango de presupuesto
                  </p>
                  <p className="text-bone font-display text-2xl">A medida</p>
                  <p className="text-fog text-sm mt-2">Precios personalizados según alcance</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" variant="dark">
        <Container maxWidth="lg">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-display font-bold text-bone">
                ¿Listo para producir tu próxima pieza?
              </h2>
              <p className="text-lg text-fog max-w-2xl mx-auto leading-relaxed">
                Cuéntanos tu visión, calendario y entregables. Te responderemos con enfoque inicial y próximos pasos.
              </p>
            </div>
            <LinkButton href="/contact" variant="primary" size="lg">
              Reserva una consulta de producción
            </LinkButton>
          </div>
        </Container>
      </Section>
    </div>
  );
}
