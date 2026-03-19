'use client';

import { useRef, useEffect, useMemo } from 'react';
import type { ProjectGroup, VideoEntry } from '@/data/diary';
import VideoCard from './VideoCard';

/* ── Per-project accent colours ────────────────────────────── */
const accents = ['#f1a93a', '#5ba4cf', '#6cb87e', '#c7422e', '#9b7fd4', '#d4a055', '#4fc1c1'];

/* ── Unique mesh gradients per project ───────────────────── */
const meshGradients = [
  // Fratelli: warm amber sweep
  `radial-gradient(ellipse at 20% 30%, rgba(241,169,58,0.10), transparent 50%),
   radial-gradient(circle at 80% 70%, rgba(199,66,46,0.06), transparent 45%),
   radial-gradient(circle at 50% 90%, rgba(241,169,58,0.04), transparent 40%)`,
  // Clínica: cool cyan sweep
  `radial-gradient(ellipse at 10% 20%, rgba(91,164,207,0.10), transparent 50%),
   radial-gradient(circle at 90% 60%, rgba(91,164,207,0.06), transparent 40%),
   radial-gradient(circle at 40% 80%, rgba(75,140,200,0.04), transparent 45%)`,
  // Midas: mossy radial
  `radial-gradient(ellipse at 75% 80%, rgba(108,184,126,0.10), transparent 50%),
   radial-gradient(circle at 20% 30%, rgba(27,42,38,0.12), transparent 45%),
   radial-gradient(circle at 50% 10%, rgba(108,184,126,0.04), transparent 40%)`,
  // Cortometrajes: deep red haze
  `radial-gradient(ellipse at 50% 50%, rgba(199,66,46,0.09), transparent 50%),
   radial-gradient(circle at 10% 80%, rgba(199,66,46,0.05), transparent 40%),
   radial-gradient(circle at 85% 20%, rgba(241,169,58,0.04), transparent 45%)`,
  // Corporativo: purple fog
  `radial-gradient(ellipse at 15% 60%, rgba(155,127,212,0.10), transparent 50%),
   radial-gradient(circle at 80% 25%, rgba(155,127,212,0.06), transparent 45%),
   radial-gradient(circle at 50% 95%, rgba(120,100,180,0.04), transparent 40%)`,
  // Música: warm gold scatter
  `radial-gradient(circle at 25% 20%, rgba(212,160,85,0.10), transparent 40%),
   radial-gradient(circle at 70% 75%, rgba(212,160,85,0.07), transparent 45%),
   radial-gradient(circle at 50% 45%, rgba(241,169,58,0.04), transparent 35%)`,
  // Eventos: teal edge glow
  `radial-gradient(ellipse at 85% 40%, rgba(79,193,193,0.10), transparent 50%),
   radial-gradient(circle at 15% 80%, rgba(79,193,193,0.06), transparent 45%),
   radial-gradient(circle at 50% 10%, rgba(79,193,193,0.03), transparent 40%)`,
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
      {/* ── Ambient background video ──────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          key={group.videos[0]?.base}
          src={`/videos/previews/${group.videos[0]?.base}-preview.mp4`}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ opacity: 0.07, filter: 'grayscale(1) brightness(0.4) contrast(1.3)' }}
        />
      </div>

      {/* ── Mesh gradient background ───────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: meshGradients[index % meshGradients.length] }}
      />

      {/* ── Floating particles ─────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
              animation: `diary-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-24 md:pt-28 px-6 md:px-12 lg:px-20 pb-28 max-w-[1920px] mx-auto">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] uppercase tracking-[0.35em] font-semibold" style={{ color: accent }}>
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <span className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: accent, opacity: 0.3 }} />
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-bone leading-[0.95] mb-3">
            {group.name}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
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
            <h3 className="text-xs uppercase tracking-[0.2em] text-fog/40 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" strokeWidth="1.5" /></svg>
              Horizontal
              <span className="text-fog/25">· {horizontal.length}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {horizontal.map((video, idx) => (
                <VideoCard key={video.base} video={video} index={idx} onClick={() => onSelect(video)} />
              ))}
            </div>
          </div>
        )}

        {/* ── Vertical videos ─────────────────────────────── */}
        {vertical.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-fog/40 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2" strokeWidth="1.5" /></svg>
              Vertical
              <span className="text-fog/25">· {vertical.length}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
              {vertical.map((video, idx) => (
                <VideoCard key={video.base} video={video} index={idx} onClick={() => onSelect(video)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
