/* ─── Diary / Portfolio video data ───────────────────────────── */

export interface VideoEntry {
  title: string;
  base: string;
  description: string;
  date: string;
  project: string;
  aspect: '9:16' | '16:9';
  tags: string[];
  featured?: boolean;
}

export interface ProjectGroup {
  name: string;
  slug: string;
  videos: VideoEntry[];
}

/* ─── Video catalogue ───────────────────────────────────────── */
export const videos: VideoEntry[] = [
  /* ── Fratelli Pazzi ──────────────────────────────────────── */
  {
    title: 'Intro Fratelli Pazzi',
    base: 'EDIT_INICIAL_L_FRATELLI_PAZZI_v2',
    description: 'Secuencia introductoria del proyecto Fratelli Pazzi',
    date: '2025',
    project: 'Fratelli Pazzi',
    aspect: '9:16',
    tags: ['edición', 'branding'],
    featured: true,
  },
  {
    title: 'Crujido de pizza — edición final',
    base: 'EDIT_CRUJIDO_PIZZA_FRATELLI_PAZZI_v2',
    description: 'Captura del momento perfecto del crujido de la pizza',
    date: '2025',
    project: 'Fratelli Pazzi',
    aspect: '9:16',
    tags: ['edición', 'sonido'],
  },
  {
    title: 'Promo Cabramelizada',
    base: 'EDIT_REEL_FRATELLI_PAZZI_PROMO_CABRAMELIZADA_V1',
    description: 'Reel promocional con énfasis en nuestro toque especial',
    date: '2025',
    project: 'Fratelli Pazzi',
    aspect: '9:16',
    tags: ['promo', 'edición'],
  },
  {
    title: 'Timelapse pizza',
    base: 'EDIT_TIMELAPSE_PIZZA_FRATELLI_PAZZI_v2',
    description: 'Timelapse del proceso de creación de pizza',
    date: '2025',
    project: 'Fratelli Pazzi',
    aspect: '9:16',
    tags: ['timelapse', 'grabación'],
  },
  {
    title: 'Arreglando horno Fratelli Pazzi',
    base: 'ARREGLANDO_HORNO_FRATELLI_PAZZI',
    description: 'Proceso de arreglo y mantenimiento del horno tradicional',
    date: '2025',
    project: 'Fratelli Pazzi',
    aspect: '9:16',
    tags: ['grabación', 'documental'],
  },

  /* ── Clínica Barragán ────────────────────────────────────── */
  {
    title: 'Reel Braquioplastia',
    base: 'CB_REEL_BRAQUIOPLASTIA',
    description: 'Reel promocional del tratamiento de braquioplastia',
    date: '2025',
    project: 'Clínica Barragán',
    aspect: '9:16',
    tags: ['reel', 'clínica', 'braquioplastia'],
  },
  {
    title: 'Reel Capilar',
    base: 'CB_REEL_CAPILAR',
    description: 'Reel de tratamiento capilar con enfoque cinematográfico',
    date: '2025',
    project: 'Clínica Barragán',
    aspect: '16:9',
    tags: ['reel', 'clínica', 'capilar'],
  },
  {
    title: 'Reel Futurista',
    base: 'CB_REEL_FUTURISTA',
    description: 'Pieza audiovisual estética futurista para Clínica Barragán',
    date: '2025',
    project: 'Clínica Barragán',
    aspect: '16:9',
    tags: ['reel', 'clínica', 'futurista'],
  },
  {
    title: 'Visualizer Second Skin',
    base: 'CB_VISUALIZER_SECOND_SKIN',
    description: 'Visualizer conceptual "Second Skin" con estética caucásica',
    date: '2025',
    project: 'Clínica Barragán',
    aspect: '16:9',
    tags: ['visualizer', 'clínica', 'concepto'],
  },
  {
    title: 'Visualizer Manchas',
    base: 'CB_VISUALIZER_MANCHAS',
    description: 'Pieza visual sobre tratamiento de manchas cutáneas',
    date: '2025',
    project: 'Clínica Barragán',
    aspect: '9:16',
    tags: ['visualizer', 'clínica', 'dermatología'],
  },
  {
    title: 'Visualizer Rejuvenecimiento',
    base: 'CB_VISUALIZER_REJUVENECIMIENTO',
    description: 'Visualizer sobre rejuvenecimiento facial con look premium',
    date: '2025',
    project: 'Clínica Barragán',
    aspect: '9:16',
    tags: ['visualizer', 'clínica', 'rejuvenecimiento'],
  },

  /* ── Midas Alonso ────────────────────────────────────────── */
  {
    title: 'Cóndor',
    base: 'MIDAS_CONDOR',
    description: 'Visualizer con etalonaje para el tema "Cóndor" de Midas Alonso',
    date: '2025',
    project: 'Midas Alonso',
    aspect: '16:9',
    tags: ['color grade', 'música', 'visualizer'],
  },
  {
    title: 'Llantos y Ortigas',
    base: 'MIDAS_LLANTOS_Y_ORTIGAS',
    description: 'Visualizer con color grade para "Llantos y Ortigas"',
    date: '2025',
    project: 'Midas Alonso',
    aspect: '16:9',
    tags: ['color grade', 'música', 'visualizer'],
  },

  /* ── Cortometrajes ───────────────────────────────────────── */
  {
    title: 'Juan Caballo',
    base: 'CORTO_JUAN_CABALLO',
    description: 'Cortometraje "Juan Caballo" — color grade y visualizer',
    date: '2025',
    project: 'Cortometrajes',
    aspect: '16:9',
    tags: ['color grade', 'cortometraje', 'narrativa'],
  },
  {
    title: 'Yo pude ser Manolito',
    base: 'CORTO_MANOLITO',
    description: 'Cortometraje "Yo pude ser Manolito" — montaje y dirección visual',
    date: '2025',
    project: 'Cortometrajes',
    aspect: '16:9',
    tags: ['montaje', 'cortometraje', 'narrativa'],
  },

  /* ── Corporativo ─────────────────────────────────────────── */
  {
    title: 'Dcycle — Corporativo',
    base: 'CORP_DCYCLE',
    description: 'Vídeo corporativo completo para Dcycle',
    date: '2025',
    project: 'Corporativo',
    aspect: '16:9',
    tags: ['corporativo', 'full pack'],
  },
  {
    title: 'Grupo Toledo — Corporativo',
    base: 'CORP_GRUPOTOLEDO',
    description: 'Pieza corporativa principal para Grupo Toledo',
    date: '2025',
    project: 'Corporativo',
    aspect: '16:9',
    tags: ['corporativo', 'full pack'],
  },
  {
    title: 'Grupo Toledo — Píldoras',
    base: 'CORP_GRUPOTOLEDO_PILDORAS',
    description: 'Píldoras de contenido en formato vertical para Grupo Toledo',
    date: '2025',
    project: 'Corporativo',
    aspect: '9:16',
    tags: ['corporativo', 'reels', 'píldoras'],
  },
  {
    title: 'Grupo Toledo — Reels',
    base: 'CORP_GRUPOTOLEDO_REELS',
    description: 'Pack de reels verticales para las redes de Grupo Toledo',
    date: '2025',
    project: 'Corporativo',
    aspect: '9:16',
    tags: ['corporativo', 'reels'],
  },
  {
    title: 'Frezyderm — Reels',
    base: 'CORP_FREZYDERM_REELS',
    description: 'Pack de reels promocionales para Frezyderm',
    date: '2025',
    project: 'Corporativo',
    aspect: '9:16',
    tags: ['corporativo', 'reels', 'cosmética'],
  },

  /* ── Música / Artistas ───────────────────────────────────── */
  {
    title: 'Dos Extraños (Live Session) — Marina Reche',
    base: 'MARINA_DOS_EXTRANOS',
    description: 'Visualizer de la live session "Dos Extraños" de Marina Reche',
    date: '2025',
    project: 'Música',
    aspect: '16:9',
    tags: ['visualizer', 'live session', 'música'],
  },
  {
    title: 'Por si quieres volver (Live Session) — Marina Reche',
    base: 'MARINA_POR_SI_QUIERES_VOLVER',
    description: 'Visualizer de la live session "Por si quieres volver"',
    date: '2025',
    project: 'Música',
    aspect: '16:9',
    tags: ['visualizer', 'live session', 'música'],
  },
  {
    title: 'Falta Algo — Pante',
    base: 'PANTE_FALTA_ALGO',
    description: 'Visualizer para el tema "Falta Algo" de Pante',
    date: '2025',
    project: 'Música',
    aspect: '16:9',
    tags: ['visualizer', 'música'],
  },
  {
    title: 'Inmortales — JDose ft Alberdi',
    base: 'JDOSE_INMORTALES',
    description: 'Visualizer para "Inmortales" de JDose ft Alberdi',
    date: '2025',
    project: 'Música',
    aspect: '16:9',
    tags: ['visualizer', 'música', 'colaboración'],
  },
  {
    title: 'Víbora — Traylou',
    base: 'TRAYLOU_VIBORA',
    description: 'Visualizer para el tema "Víbora" de Traylou',
    date: '2025',
    project: 'Música',
    aspect: '16:9',
    tags: ['visualizer', 'música'],
  },
  {
    title: 'Podcast Melomanía',
    base: 'PODCAST_MELOMANIA',
    description: 'Visualizer para el podcast Melomanía',
    date: '2025',
    project: 'Música',
    aspect: '16:9',
    tags: ['visualizer', 'podcast', 'música'],
  },

  /* ── Eventos ─────────────────────────────────────────────── */
  {
    title: 'Vulkan Party — Promo',
    base: 'VULKAN_PARTY_PROMO',
    description: 'Reels promocionales para el evento Vulkan Party',
    date: '2025',
    project: 'Eventos',
    aspect: '9:16',
    tags: ['montaje', 'color', 'evento', 'reels'],
  },
];

/* ─── Helpers ───────────────────────────────────────────────── */

/** Group videos by project, preserving order of first appearance. */
export function groupByProject(list: VideoEntry[]): ProjectGroup[] {
  const map = new Map<string, VideoEntry[]>();

  for (const v of list) {
    const existing = map.get(v.project);
    if (existing) {
      existing.push(v);
    } else {
      map.set(v.project, [v]);
    }
  }

  return Array.from(map.entries()).map(([name, vids]) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    videos: vids,
  }));
}

/** Return the first video marked as featured, or fallback to first video. */
export function getFeaturedVideo(list: VideoEntry[]): VideoEntry | undefined {
  return list.find((v) => v.featured) ?? list[0];
}

/** Unique project names (preserving order). */
export function getProjectNames(list: VideoEntry[]): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const v of list) {
    if (!seen.has(v.project)) {
      seen.add(v.project);
      names.push(v.project);
    }
  }
  return names;
}
