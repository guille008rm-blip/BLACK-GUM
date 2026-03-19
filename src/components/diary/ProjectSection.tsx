'use client';

import { useRef, useEffect, useMemo } from 'react';
import type { ProjectGroup, VideoEntry } from '@/data/diary';
import VideoCard from './VideoCard';

/* ── Per-project accent colours ────────────────────────────── */
const accents = ['#f1a93a', '#5ba4cf', '#6cb87e', '#c7422e', '#9b7fd4', '#d4a055', '#4fc1c1'];

/* ── Unique mesh gradients per project ───────────────────── */
const meshGradients = [
  // Fratelli: warm amber sweep
  `radial-gradient(ellipse at 20% 30%, rgba(241,169,58,0.22), transparent 55%),
   radial-gradient(circle at 80% 70%, rgba(199,66,46,0.12), transparent 50%),
   radial-gradient(circle at 50% 90%, rgba(241,169,58,0.08), transparent 45%)`,
  // Clínica: cool cyan sweep
  `radial-gradient(ellipse at 10% 20%, rgba(91,164,207,0.22), transparent 55%),
   radial-gradient(circle at 90% 60%, rgba(91,164,207,0.12), transparent 45%),
   radial-gradient(circle at 40% 80%, rgba(75,140,200,0.08), transparent 50%)`,
  // Midas: mossy radial
  `radial-gradient(ellipse at 75% 80%, rgba(108,184,126,0.22), transparent 55%),
   radial-gradient(circle at 20% 30%, rgba(27,42,38,0.20), transparent 50%),
   radial-gradient(circle at 50% 10%, rgba(108,184,126,0.08), transparent 45%)`,
  // Cortometrajes: deep red haze
  `radial-gradient(ellipse at 50% 50%, rgba(199,66,46,0.20), transparent 55%),
   radial-gradient(circle at 10% 80%, rgba(199,66,46,0.10), transparent 45%),
   radial-gradient(circle at 85% 20%, rgba(241,169,58,0.08), transparent 50%)`,
  // Corporativo: purple fog
  `radial-gradient(ellipse at 15% 60%, rgba(155,127,212,0.22), transparent 55%),
   radial-gradient(circle at 80% 25%, rgba(155,127,212,0.12), transparent 50%),
   radial-gradient(circle at 50% 95%, rgba(120,100,180,0.08), transparent 45%)`,
  // Música: warm gold scatter
  `radial-gradient(circle at 25% 20%, rgba(212,160,85,0.22), transparent 45%),
   radial-gradient(circle at 70% 75%, rgba(212,160,85,0.14), transparent 50%),
   radial-gradient(circle at 50% 45%, rgba(241,169,58,0.08), transparent 40%)`,
  // Eventos: teal edge glow
  `radial-gradient(ellipse at 85% 40%, rgba(79,193,193,0.22), transparent 55%),
   radial-gradient(circle at 15% 80%, rgba(79,193,193,0.12), transparent 50%),
   radial-gradient(circle at 50% 10%, rgba(79,193,193,0.06), transparent 45%)`,
];

/* ── Particle positions for floating orbs ───────────────── */
const particles = [
  { x: '12%', y: '18%', size: 6, delay: 0, duration: 7 },
  { x: '78%', y: '25%', size: 4, delay: 1.5, duration: 9 },
  { x: '45%', y: '65%', size: 5, delay: 3, duration: 8 },
  { x: '88%', y: '72%', size: 3, delay: 0.8, duration: 10 },
  { x: '25%', y: '82%', size: 5, delay: 2.2, duration: 7.5 },
  { x: '62%', y: '12%', size: 4, delay: 4, duration: 8.5 },
];

interface ProjectSectionProps {
  group: ProjectGroup;
  index: number;
  total: number;
  onSelect: (video: VideoEntry) => void;
}

export default function ProjectSection({ group, index, total, onSelect }: ProjectSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const accent = accents[index % accents.length];

  const horizontal = useMemo(() => group.videos.filter((v) => v.aspect === '16:9'), [group.videos]);
  const vertical = useMemo(() => group.videos.filter((v) => v.aspect === '9:16'), [group.videos]);

  const tags = useMemo(
    () => Array.from(new Set(group.videos.flatMap((v) => v.tags))),
    [group.videos],
  );

  useEffect(() => {
    containerRef.current?.scrollTo(0, 0);
  }, [group.slug]);

  return (
    <section ref={containerRef} className="h-full overflow-y-auto relative bg-ink">
      {/* ── Background layers (single sticky container) ── */}
      <div className="sticky top-0 h-screen w-full pointer-events-none overflow-hidden" style={{ marginBottom: '-100vh', zIndex: 0 }}>
        {/* Ambient poster (static image instead of video — same visual, zero GPU cost) */}
        <img
          key={group.videos[0]?.base}
          src={`${process.env.NEXT_PUBLIC_VIDEO_CDN || '/videos'}/posters/${group.videos[0]?.base}.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.12, filter: 'grayscale(1) brightness(0.4) contrast(1.3)' }}
        />
        {/* Mesh gradient */}
        <div
          className="absolute inset-0"
          style={{ background: meshGradients[index % meshGradients.length] }}
        />
        {/* Floating particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: accent,
              opacity: 0.10,
              filter: 'blur(1px)',
              willChange: 'transform',
              contain: 'strict',
              animation: `diary-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-24 md:pt-28 px-6 md:px-12 lg:px-20 pb-28 max-w-[1920px] mx-auto">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-bone leading-[0.95] mb-3">
            {group.name}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {tags.slice(0, 6).map((tag) => (
              <span key={tag} className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-0.5 rounded-full border border-white/[0.08] text-fog/50">
                {tag}
              </span>
            ))}
            <span className="text-xs text-fog/30 ml-1">
              · {group.videos.length} {group.videos.length === 1 ? 'pieza' : 'piezas'}
            </span>
          </div>
        </div>

        {/* ── Horizontal videos ───────────────────────────── */}
        {horizontal.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.2em] text-fog/40 mb-4 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" strokeWidth="1.5" /></svg>
              Horizontal
              <span className="text-fog/25">· {horizontal.length}</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-5 max-w-[1200px] mx-auto">
              {horizontal.map((video, idx) => (
                <div key={video.base} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
                  <VideoCard video={video} index={idx} onClick={() => onSelect(video)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Vertical videos ─────────────────────────────── */}
        {vertical.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-fog/40 mb-4 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2" strokeWidth="1.5" /></svg>
              Vertical
              <span className="text-fog/25">· {vertical.length}</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-5 max-w-[1400px] mx-auto">
              {vertical.map((video, idx) => (
                <div key={video.base} className="w-[calc(50%-10px)] sm:w-[calc(33.333%-14px)] md:w-[calc(25%-15px)] lg:w-[calc(20%-16px)]">
                  <VideoCard video={video} index={idx} onClick={() => onSelect(video)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
