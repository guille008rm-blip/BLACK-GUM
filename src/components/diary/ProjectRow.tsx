'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import type { ProjectGroup, VideoEntry } from '@/data/diary';
import VideoCard from './VideoCard';

interface ProjectRowProps {
  group: ProjectGroup;
  onSelect: (video: VideoEntry) => void;
}

export default function ProjectRow({ group, onSelect }: ProjectRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('[data-video-card]')?.clientWidth ?? 300;
    el.scrollBy({ left: direction === 'left' ? -cardWidth - 24 : cardWidth + 24, behavior: 'smooth' });
  };

  /* Collect unique tags across all videos in this project */
  const tags = Array.from(new Set(group.videos.flatMap((v) => v.tags)));

  return (
    <div className="mb-14">
      {/* ── Row header ───────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-5 px-6 md:px-12 lg:px-20 max-w-[1920px] mx-auto">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-bone leading-tight">
            {group.name}
          </h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-fog/60 tracking-wide">
              {group.videos.length} {group.videos.length === 1 ? 'pieza' : 'piezas'}
            </span>
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-[0.12em] text-ember/80 bg-ember/10 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Arrow controls ───────────────────────────────── */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Anterior"
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-bone/60 hover:text-ember hover:border-ember/40 transition-colors disabled:opacity-20 disabled:pointer-events-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Siguiente"
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-bone/60 hover:text-ember hover:border-ember/40 transition-colors disabled:opacity-20 disabled:pointer-events-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Horizontal scroll track ──────────────────────────── */}
      <div className="relative">
        {/* Left fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-ink to-transparent" />
        )}
        {/* Right fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-ink to-transparent" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-6 md:px-12 lg:px-20 no-scrollbar"
        >
          {group.videos.map((video, idx) => (
            <VideoCard
              key={video.base}
              video={video}
              index={idx}
              onClick={() => onSelect(video)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
