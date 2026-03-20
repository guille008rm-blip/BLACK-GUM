import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import ContactForm from "@/components/contact/ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto | Inicia tu Proyecto",
  description: "Ponte en contacto con Black Gum Studio para hablar de tu próximo proyecto creativo."
};

const contactImageSizes =
  "(min-width: 1024px) 360px, (min-width: 768px) 320px, calc(100vw - 48px)";
const contactImageSrcSet = (ext: "jpg" | "webp" | "avif") =>
  [480, 768, 1024]
    .map((width) => `/images/contact/studio-wide-w${width}.${ext} ${width}w`)
    .join(", ");

const getFirst = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default function ContactPage({
  searchParams
}: {
  searchParams?: {
    projectType?: string | string[];
    projectSummary?: string | string[];
    budget?: string | string[];
  };
}) {
  const initialValues = {
    projectType: getFirst(searchParams?.projectType),
    projectSummary: getFirst(searchParams?.projectSummary),
    budget: getFirst(searchParams?.budget)
  };

  return (
    <div className="w-full">
      <Section spacing="lg" variant="dark">
        <Container maxWidth="lg">
          <div className="grid gap-12 md:gap-16 md:grid-cols-[1.3fr_0.7fr] items-start">
            <Card variant="solid" padding="lg" className="h-fit">
              <ContactForm initialValues={initialValues} />
            </Card>

            <div>
              <div className="relative rounded-2xl overflow-hidden h-48 border border-white/10 mb-4">
                <picture className="absolute inset-0 h-full w-full">
                  <source
                    type="image/avif"
                    srcSet={contactImageSrcSet("avif")}
                    sizes={contactImageSizes}
                  />
                  <source
                    type="image/webp"
                    srcSet={contactImageSrcSet("webp")}
                    sizes={contactImageSizes}
                  />
                  <img
                    src="/images/contact/studio-wide-w768.jpg"
                    srcSet={contactImageSrcSet("jpg")}
                    sizes={contactImageSizes}
                    alt="Black Gum Studio"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              </div>

              <div className="space-y-4">
                <Card variant="glass" padding="lg">
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold">
                        Ubicación
                      </p>
                      <p className="text-lg font-display font-bold text-bone leading-tight">
                        Madrid, España
                      </p>
                    </div>
                    <p className="text-xs text-fog leading-relaxed">
                      Estudio + capacidad remota. Trabajamos con equipos globales.
                    </p>
                  </div>
                </Card>

                <Card variant="glass" padding="lg">
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold">
                        Correo electrónico
                      </p>
                      <a
                        href="mailto:info@blackgumgroup.com"
                        className="text-lg font-display font-bold text-bone hover:text-ember transition-colors"
                      >
                        info@blackgumgroup.com
                      </a>
                    </div>
                    <p className="text-xs text-fog">
                      Ideal para consultas de proyectos y resúmenes detallados.
                    </p>
                  </div>
                </Card>

                <Card variant="glass" padding="lg">
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold">
                        WhatsApp
                      </p>
                      <a
                        href="https://wa.me/0000000000"
                        className="text-lg font-display font-bold text-bone hover:text-ember transition-colors"
                      >
                        Envíanos un mensaje
                      </a>
                    </div>
                    <p className="text-xs text-fog">
                      ¿Preguntas rápidas? Normalmente respondemos pronto.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-bone">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                q: "¿Cuál es vuestro calendario de trabajo habitual?",
                a: "Depende del alcance. En producción comercial solemos movernos entre 4 y 8 semanas. En alquileres, la disponibilidad puede ser inmediata."
              },
              {
                q: "¿Trabajáis con equipos internacionales?",
                a: "Sí. Hemos rodado con equipos internacionales y colaboramos en remoto cuando el proyecto lo requiere."
              },
              {
                q: "¿Podéis personalizar paquetes creativos?",
                a: "Sí. Los paquetes son una base; adaptamos alcance, entregables y ritmo a cada necesidad."
              },
              {
                q: "¿Qué equipos están disponibles para alquilar?",
                a: "Cámaras profesionales, lentes, iluminación y accesorios. Puedes revisar inventario o consultarnos por una configuración concreta."
              },
              {
                q: "¿Ofrecéis planes de pago?",
                a: "En proyectos grandes podemos estructurar pagos por hitos de producción."
              },
              {
                q: "¿Cómo reservo una consulta?",
                a: "Escríbenos por correo o WhatsApp con un breve resumen y coordinamos una llamada para alinear objetivos y logística."
              }
            ].map((item, idx) => (
              <Card key={idx} variant="glass" padding="lg">
                <div className="space-y-3">
                  <h3 className="font-display text-lg font-bold text-bone">
                    {item.q}
                  </h3>
                  <p className="text-sm text-fog leading-relaxed">{item.a}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
