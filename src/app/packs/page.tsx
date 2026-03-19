import type { Metadata } from "next";
import PacksClientWrapper from "@/components/packs/PacksClientWrapper";
import { prisma } from "@/lib/prisma";
import { parseDeliverables } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Paquetes Creativos | Sistemas de Producción Predefinidos",
  description:
    "Explora los paquetes creativos de Black Gum para sprints de contenido, lanzamientos de campaña y producción cinematográfica."
};

export const dynamic = "force-dynamic";

export default async function PacksPage({
  searchParams
}: {
  searchParams?: { section?: string };
}) {
  const packs = await prisma.pack.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
  });

  const normalizedPacks = packs.map((pack) => ({
    ...pack,
    kind: normalizeKind(pack.kind),
    deliverables: parseDeliverables(pack.deliverables)
  }));

  const sections = [
    {
      key: "campaign",
      title: "Paquetes de Campaña",
      subtitle:
        "Paquetes creativos para campañas ambiciosas y lanzamientos con impacto.",
      image: "/paquetes/pack-campaign.png",
      video: "/paquetes/pack-campaign-opt.mp4",
      tagline: "Lanzamientos con impacto",
      empty: "Sin paquetes de campaña por ahora. Ponte en contacto y crearemos uno juntos."
    },
    {
      key: "monthly",
      title: "Paquetes Sociales Mensuales",
      subtitle:
        "Paquetes mensuales para mantener tus canales activos con producción consistente.",
      image: "/paquetes/pack-monthly.png",
      video: "/paquetes/pack-monthly-opt.mp4",
      tagline: "Ritmo social mensual",
      empty: "Sin paquetes mensuales listados por ahora. Crearemos un ritmo social para ti."
    },
    {
      key: "alacarte",
      title: "A la carta",
      subtitle: "Servicios sueltos listos para combinar según tu necesidad.",
      image: "/paquetes/pack-alacarte.png",
      video: "/paquetes/pack-alacarte-opt.mp4",
      tagline: "Servicios a medida",
      empty: "Los servicios a la carta aparecerán aquí pronto."
    }
  ];

  const hasSelection = Boolean(searchParams?.section);
  const activeSection = searchParams?.section || "campaign";

  return (
    <div className="w-full">
      <PacksClientWrapper
        sections={sections}
        packs={normalizedPacks}
        activeSection={activeSection}
        hasSelection={hasSelection}
      />
    </div>
  );
}

function normalizeKind(value: string | null | undefined) {
  if (value === "campaign" || value === "monthly" || value === "alacarte") {
    return value;
  }
  return "monthly";
}


