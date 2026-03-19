'use client';

import { useRef, useEffect } from 'react';
import type { VideoEntry } from '@/data/diary';

interface DiaryHeroProps {
  video?: VideoEntry;
}

export default function DiaryHero({ video }: DiaryHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) vid.play().catch(() => {});
  }, [video?.base]);

  return (
    <section className="relative w-full h-[70vh] min-h-[480px] max-h-[800px] overflow-hidden">
      {/* ── Background video / poster fallback ─────────────── */}
      {video ? (
        <video
          ref={videoRef}
          key={video.base}
          src={`${process.env.NEXT_PUBLIC_VIDEO_CDN || '/videos'}/full/${video.base}-full.mp4`}
          poster={`${process.env.NEXT_PUBLIC_VIDEO_CDN || '/videos'}/posters/${video.base}.jpg`}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover diary-hero-ken-burns"
        />
      ) : (
        <div className="absolute inset-0 bg-ink" />
      )}

      {/* ── Gradient overlays ──────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/40 to-transparent" />

      {/* ── Ember radial glow ──────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 80%, rgba(241,169,58,0.10), transparent 50%)',
        }}
      />

      {/* ── Text content ───────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-12 md:pb-16 max-w-7xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.35em] text-ember font-semibold mb-3">
          Portfolio
        </p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[0.95] text-bone drop-shadow-lg">
          Nuestro trabajo
        </h1>

        <div className="mt-4 flex items-center gap-4">
          <span className="h-px w-10 bg-ember/70" />
          <p className="max-w-lg text-fog text-sm md:text-base leading-relaxed font-light">
            Cada cuadro cuenta una historia. Estas son las nuestras.
          </p>
        </div>

        {video && (
          <div className="mt-5 flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-ember animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-bone/60">
              {video.project} — {video.title}
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom fade for smooth transition ──────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink to-transparent" />
    </section>
  );
}
