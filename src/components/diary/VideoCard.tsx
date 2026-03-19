'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import type { VideoEntry } from '@/data/diary';

interface VideoCardProps {
  video: VideoEntry;
  index: number;
  onClick: () => void;
  /** If used inside masonry layout (different sizing) */
  masonry?: boolean;
}

export default function VideoCard({ video, index, onClick, masonry }: VideoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const lastHover = useRef(0);

  /* ── Intersection Observer: lazy-load + visibility tracking ─── */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          const vid = videoRef.current;
          if (vid && vid.preload === 'none') vid.preload = 'metadata';
        } else {
          const vid = videoRef.current;
          if (vid && !vid.paused) {
            vid.pause();
            vid.currentTime = 0;
          }
        }
      },
      { rootMargin: '200px 0px', threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Throttled hover handlers ────────────────────────────── */
  const handleMouseEnter = useCallback(() => {
    const now = Date.now();
    if (now - lastHover.current < 150) return;
    lastHover.current = now;
    const vid = videoRef.current;
    if (vid && vid.paused) vid.play().catch(() => {});
  }, []);

  const handleMouseLeave = useCallback(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.pause();
      vid.currentTime = 0;
    }
  }, []);

  /* ── Sizing ──────────────────────────────────────────────── */
  const isVertical = video.aspect === '9:16';

  const cardStyle: React.CSSProperties = masonry
    ? {
        width: '100%',
        aspectRatio: isVertical ? '9 / 16' : '16 / 9',
      }
    : {
        width: isVertical ? 260 : 440,
        height: isVertical ? 462 : 248,
        flexShrink: 0,
      };

  return (
    <div
      ref={cardRef}
      data-video-card
      className={`group cursor-pointer snap-start transition-all duration-300 hover:scale-[1.03] ${
        visible ? 'diary-card-visible' : 'diary-card-hidden'
      }`}
      style={{
        ...cardStyle,
        transitionDelay: `${index * 60}ms`,
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-xl video-card-surface border border-white/8 group-hover:border-ember/50 group-hover:shadow-[0_0_24px_rgba(241,169,58,0.25)] transition-all duration-300 w-full h-full">
        {/* ── Video / poster ───────────────────────────────── */}
        <video
          ref={videoRef}
          src={`/videos/previews/${video.base}-preview.mp4`}
          poster={`/videos/posters/${video.base}.jpg`}
          preload="none"
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {/* ── Hover gradient overlay ───────────────────────── */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* ── Info on hover ────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-[10px] uppercase tracking-[0.15em] text-ember/90 mb-1">
            {video.project}
          </p>
          <p className="text-sm font-semibold text-bone leading-snug line-clamp-2">
            {video.title}
          </p>
        </div>

        {/* ── Play icon ────────────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-ink/60 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-bone ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
