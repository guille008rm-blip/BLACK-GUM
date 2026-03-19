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
