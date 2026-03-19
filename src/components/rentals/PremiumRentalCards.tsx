"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import BookingModal from "@/components/rentals/BookingModal";

type CtaAction = "availability" | "quote";

interface RentalProduct {
  id: string;
  name: string;
  category: string;
  descriptor: string;
  useCase: string;
  keySpecs: string[];
  imageSrc: string;
  fallbackLabel: string;
  prefillLabel: string;
}

const rentals: RentalProduct[] = [
  {
    id: "smallhd-cine-18",
    name: "SmallHD Cine 18",
    category: "Monitorado en rodaje",
    descriptor:
      "Monitor 4K high-bright de 18 pulgadas para direccion, cliente y flujo DIT.",
    useCase: "Ideal para video village y revisiones en set con referencia estable.",
    keySpecs: [
      "18\" UHD 4K",
      "1100 nits",
      "4x 12G-SDI + HDMI 2.0"
    ],
    imageSrc: "/assets/rentals/smallhd-cine-18.png",
    fallbackLabel: "SmallHD",
    prefillLabel: "SmallHD Cine 18"
  },
  {
    id: "teradek-bolt-6-lt-750",
    name: "Teradek Bolt 6 LT 750",
    category: "Video inalambrico",
    descriptor:
      "Sistema TX/RX de baja latencia para monitorado inalambrico en rodaje.",
    useCase: "Ideal para direccion, foco, gimbal y setups de camara en movimiento.",
    keySpecs: [
      "TX + RX",
      "Hasta 750 ft",
      "Bandas 6 GHz y 5 GHz"
    ],
    imageSrc: "/assets/rentals/teradek-bolt-6-lt-750.png",
    fallbackLabel: "Teradek",
    prefillLabel: "Teradek Bolt 6 LT 750"
  }
];

const buildContactUrl = (productLabel: string, action: CtaAction) => {
  const params = new URLSearchParams({
    projectType: `Alquiler ${productLabel}`,
    projectSummary:
      action === "availability"
        ? `Quiero consultar disponibilidad para ${productLabel}.`
        : `Quiero solicitar presupuesto para ${productLabel}.`,
    budget: action === "quote" ? "Presupuesto a medida" : ""
  });

  return `/contact?${params.toString()}`;
};

export default function PremiumRentalCards() {
  const router = useRouter();
  const [missingImage, setMissingImage] = useState<Record<string, boolean>>({});
  const [bookingTarget, setBookingTarget] = useState<{ slug: string; name: string } | null>(null);

  const handleCtaClick = (productLabel: string, action: CtaAction) => {
    router.push(buildContactUrl(productLabel, action));
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
        {rentals.map((item) => {
          const showFallback = missingImage[item.id];

          return (
            <Card
              key={item.id}
              variant="solid"
              padding="lg"
              className="rentals-card relative overflow-hidden border-white/15"
            >
              <div className="space-y-6">
                <div className="rentals-hero relative overflow-hidden rounded-xl border border-white/10">
                  <div className="rentals-hero-smoke" aria-hidden="true" />
                  <div className="rentals-hero-glint" aria-hidden="true" />

                  {!showFallback ? (
                    <img
                      src={item.imageSrc}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="rentals-product-image"
                      onError={() =>
                        setMissingImage((prev) => ({ ...prev, [item.id]: true }))
                      }
                    />
                  ) : (
                    <div className="rentals-placeholder" aria-label={`${item.name} placeholder`}>
                      <span className="rentals-placeholder-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="3.5" y="6.5" width="17" height="11" rx="2.5" />
                          <path d="M8 17.5v2m8-2v2M8 4.5h8" />
                        </svg>
                      </span>
                      <span>{item.fallbackLabel}</span>
                    </div>
                  )}

                  <div className="rentals-ground-shadow" aria-hidden="true" />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary">{item.category}</Badge>
                    <span className="text-xs uppercase tracking-[0.14em] text-fog/70">
                      Kit profesional
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold text-bone">{item.name}</h3>
                    <p className="text-base text-fog leading-relaxed">{item.descriptor}</p>
                    <p className="text-sm text-fog/85">{item.useCase}</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-ember font-semibold mb-2">
                      Specs clave
                    </p>
                    <ul className="space-y-1 text-sm text-fog">
                      {item.keySpecs.map((line) => (
                        <li key={line} className="flex gap-2 leading-relaxed">
                          <span className="text-ember" aria-hidden="true">
                            &bull;
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-2 rounded-xl border border-white/10 bg-ink/55 p-4 text-sm">
                    <p className="text-xs uppercase tracking-[0.16em] text-fog/75">
                      Precio y disponibilidad
                    </p>
                    <p className="text-bone font-medium">Presupuesto a medida segun fechas y duracion.</p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      className="btn-cinematic rentals-cta"
                      onClick={() => setBookingTarget({ slug: item.id, name: item.name })}
                    >
                      Consultar disponibilidad
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="btn-cinematic rentals-cta"
                      onClick={() => handleCtaClick(item.prefillLabel, "quote")}
                    >
                      Solicitar presupuesto
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {bookingTarget && (
        <BookingModal
          productSlug={bookingTarget.slug}
          productName={bookingTarget.name}
          open={true}
          onClose={() => setBookingTarget(null)}
        />
      )}
    </>
  );
}
