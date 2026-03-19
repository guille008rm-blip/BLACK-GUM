'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import type { VideoEntry } from '@/data/diary';

interface VideoCardProps {
  video: VideoEntry;
  index: number;
  onClick: () => void;
}

export default function VideoCard({ video, index, onClick }: VideoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const lastHover = useRef(0);

  /* ── Intersection Observer: lazy-load + visibility tracking ─── */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Find nearest scrollable ancestor to use as root
    let root: Element | null = el.parentElement;
    while (root && getComputedStyle(root).overflowY !== 'auto' && getComputedStyle(root).overflowY !== 'scroll') {
      root = root.parentElement;
    }

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
      { root: root || undefined, rootMargin: '200px 0px', threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Fallback: ensure visibility even if observer misses ───── */
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200 + index * 60);
    return () => clearTimeout(timer);
  }, [index]);

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

  return (
    <div
      ref={cardRef}
      data-video-card
      className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
        visible ? 'diary-card-visible' : 'diary-card-hidden'
      }`}
      style={{ transitionDelay: `${index * 40}ms` }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Thumbnail ─────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-lg border border-white/[0.06] group-hover:border-ember/40 group-hover:shadow-[0_0_16px_rgba(241,169,58,0.15)] transition-all duration-300 w-full"
        style={{ aspectRatio: isVertical ? '9 / 16' : '16 / 9' }}
      >
        <video
          ref={videoRef}
          src={`${process.env.NEXT_PUBLIC_VIDEO_CDN || '/videos'}/previews/${video.base}-preview.mp4`}
          poster={`${process.env.NEXT_PUBLIC_VIDEO_CDN || '/videos'}/posters/${video.base}.jpg`}
          preload="none"
          muted
          playsInline
          className="w-full h-full object-cover"
        />


      </div>

      {/* ── Title always visible ──────────────────────────── */}
      <p className="mt-2 text-[11px] md:text-xs text-bone/70 group-hover:text-bone leading-snug line-clamp-2 transition-colors duration-200">
        {video.title}
      </p>
    </div>
  );
}
