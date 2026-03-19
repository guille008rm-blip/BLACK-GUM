'use client';

import { useEffect, useCallback } from 'react';
import type { VideoEntry } from '@/data/diary';

interface VideoModalProps {
  video: VideoEntry;
  /** All videos in the current view, for prev/next navigation */
  playlist: VideoEntry[];
  onClose: () => void;
  onNavigate: (video: VideoEntry) => void;
}

export default function VideoModal({ video, playlist, onClose, onNavigate }: VideoModalProps) {
  const currentIndex = playlist.findIndex((v) => v.base === video.base);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) onNavigate(playlist[currentIndex - 1]);
  }, [currentIndex, onNavigate, playlist]);

  const goNext = useCallback(() => {
    if (currentIndex < playlist.length - 1) onNavigate(playlist[currentIndex + 1]);
  }, [currentIndex, onNavigate, playlist]);

  /* ── Keyboard navigation + scroll lock ──────────────────── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const header = document.querySelector('header');
    if (header) header.style.filter = 'blur(8px)';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prev;
      if (header) header.style.filter = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, goPrev, goNext]);

  const isVertical = video.aspect === '9:16';

  return (
    <>
      {/* ── Backdrop ───────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      {/* ── Modal content ──────────────────────────────────── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative pointer-events-auto flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Close button ─────────────────────────────────── */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-bone/70 hover:text-ember transition-colors z-10"
            aria-label="Cerrar video"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* ── Nav arrows ───────────────────────────────────── */}
          {currentIndex > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 rounded-full border border-white/15 bg-ink/60 backdrop-blur-sm flex items-center justify-center text-bone/70 hover:text-ember hover:border-ember/40 transition-colors"
              aria-label="Video anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {currentIndex < playlist.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 rounded-full border border-white/15 bg-ink/60 backdrop-blur-sm flex items-center justify-center text-bone/70 hover:text-ember hover:border-ember/40 transition-colors"
              aria-label="Video siguiente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* ── Video player ────────────────────────────────── */}
          <div
            className="relative overflow-hidden rounded-xl border border-white/10 shadow-[0_0_60px_rgba(241,169,58,0.15)]"
            style={
              isVertical
                ? { width: 'min(340px, 90vw)', aspectRatio: '9 / 16' }
                : { width: 'min(900px, 90vw)', aspectRatio: '16 / 9' }
            }
          >
            <video
              key={video.base}
              src={`${process.env.NEXT_PUBLIC_VIDEO_CDN || '/videos'}/full/${video.base}-full.mp4`}
              poster={`${process.env.NEXT_PUBLIC_VIDEO_CDN || '/videos'}/posters/${video.base}.jpg`}
              controls
              autoPlay
              playsInline
              preload="auto"
              className="w-full h-full object-cover bg-ink"
            />
          </div>

          {/* ── Info below video ─────────────────────────────── */}
          <div className="mt-4 text-center max-w-lg">
            <p className="text-[10px] uppercase tracking-[0.15em] text-ember/80 mb-1">
              {video.project}
            </p>
            <p className="text-base font-semibold text-bone">{video.title}</p>
            <p className="text-xs text-fog/60 mt-1">{video.description}</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] uppercase tracking-[0.12em] text-ember/70 bg-ember/8 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
