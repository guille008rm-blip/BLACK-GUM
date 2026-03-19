'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { videos, groupByProject } from '@/data/diary';
import type { VideoEntry } from '@/data/diary';
import ProjectSection from '@/components/diary/ProjectSection';
import VideoModal from '@/components/diary/VideoModal';

const styles = `
  /* ── Card entrance animations ─────────────────────────────── */
  .diary-card-hidden { opacity: 0; }
  .diary-card-visible { opacity: 1; }

  /* Per-section choreographies */
  .choreo-cascade .diary-card-hidden { transform: translateX(-40px) rotate(-2deg); }
  .choreo-cascade .diary-card-visible { transform: translateX(0) rotate(0); transition: opacity 0.5s ease-out, transform 0.6s cubic-bezier(.22,1,.36,1); }

  .choreo-rise .diary-card-hidden { transform: translateY(50px) scale(0.92); }
  .choreo-rise .diary-card-visible { transform: translateY(0) scale(1); transition: opacity 0.5s ease-out, transform 0.6s cubic-bezier(.22,1,.36,1); }

  .choreo-zoom .diary-card-hidden { transform: scale(0.7); filter: blur(4px); }
  .choreo-zoom .diary-card-visible { transform: scale(1); filter: blur(0); transition: opacity 0.4s ease-out, transform 0.5s cubic-bezier(.22,1,.36,1), filter 0.5s ease-out; }

  .choreo-flip .diary-card-hidden { transform: perspective(600px) rotateY(15deg) translateX(30px); }
  .choreo-flip .diary-card-visible { transform: perspective(600px) rotateY(0) translateX(0); transition: opacity 0.5s ease-out, transform 0.7s cubic-bezier(.22,1,.36,1); }

  .choreo-drop .diary-card-hidden { transform: translateY(-40px) scale(1.05); }
  .choreo-drop .diary-card-visible { transform: translateY(0) scale(1); transition: opacity 0.4s ease-out, transform 0.5s cubic-bezier(.34,1.56,.64,1); }

  .choreo-fan .diary-card-hidden { transform: translateX(60px) rotate(6deg); opacity: 0; }
  .choreo-fan .diary-card-visible { transform: translateX(0) rotate(0); transition: opacity 0.5s ease-out, transform 0.7s cubic-bezier(.22,1,.36,1); }

  .choreo-glitch-in .diary-card-hidden { transform: translateX(-8px); clip-path: inset(0 100% 0 0); }
  .choreo-glitch-in .diary-card-visible { transform: translateX(0); clip-path: inset(0 0 0 0); transition: opacity 0.3s, transform 0.4s cubic-bezier(.22,1,.36,1), clip-path 0.4s cubic-bezier(.22,1,.36,1); }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  /* ── Film burn transition ────────────────────────────────── */
  @keyframes diary-burn-out {
    0%   { opacity: 1; transform: scale(1); filter: brightness(1) saturate(1) blur(0px); }
    40%  { opacity: 0.85; transform: scale(1.01); filter: brightness(1.8) saturate(0.4) blur(0px); }
    70%  { opacity: 0.4; transform: scale(1.03); filter: brightness(2.8) saturate(0) blur(2px); }
    100% { opacity: 0; transform: scale(1.06); filter: brightness(4) saturate(0) blur(5px); }
  }

  @keyframes diary-burn-in {
    0%   { opacity: 0; transform: translateY(10px) scale(0.97); filter: brightness(0.3) saturate(0.2); }
    35%  { opacity: 0.7; transform: translateY(3px) scale(0.99); filter: brightness(1.2) saturate(0.7); }
    100% { opacity: 1; transform: translateY(0) scale(1); filter: brightness(1) saturate(1); }
  }

  @keyframes diary-flash-pulse {
    0%   { opacity: 0; }
    12%  { opacity: 0.55; }
    35%  { opacity: 0.2; }
    60%  { opacity: 0.08; }
    100% { opacity: 0; }
  }

  .diary-burn-out {
    animation: diary-burn-out 0.4s ease-in forwards;
  }
  .diary-burn-in {
    animation: diary-burn-in 0.5s cubic-bezier(.22,1,.36,1) forwards;
  }
  .diary-flash-active {
    animation: diary-flash-pulse 0.55s ease-out forwards;
  }

  /* ── Scan lines overlay ──────────────────────────────────── */
  @keyframes scanline-scroll {
    0%   { transform: translateY(0); }
    100% { transform: translateY(4px); }
  }

  @media (prefers-reduced-motion: no-preference) {
    .diary-scanlines {
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255,255,255,0.015) 2px,
        rgba(255,255,255,0.015) 4px
      );
      animation: scanline-scroll 0.15s linear infinite;
    }
  }

  /* ── Floating particles ──────────────────────────────────── */
  @keyframes diary-float {
    0%   { transform: translate(0, 0) scale(1); opacity: 0.10; }
    25%  { transform: translate(6px, -12px) scale(1.1); opacity: 0.16; }
    50%  { transform: translate(-4px, -20px) scale(0.95); opacity: 0.08; }
    75%  { transform: translate(8px, -10px) scale(1.05); opacity: 0.14; }
    100% { transform: translate(0, 0) scale(1); opacity: 0.10; }
  }
`;

export default function ProductionDiary() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoEntry | null>(null);
  const [phase, setPhase] = useState<'idle' | 'burn-out' | 'burn-in'>('idle');
  const [showFlash, setShowFlash] = useState(false);

  const groups = useMemo(() => groupByProject(videos), []);
  const activeGroup = groups[activeIndex];

  const choreographies = ['choreo-cascade','choreo-rise','choreo-zoom','choreo-flip','choreo-drop','choreo-fan','choreo-glitch-in'];
  const choreo = choreographies[activeIndex % choreographies.length];

  /* ── Section navigation with film-burn transition ──────── */
  const navigateTo = useCallback(
    (index: number) => {
      if (index === activeIndex || phase !== 'idle' || index < 0 || index >= groups.length) return;
      setPhase('burn-out');
      setShowFlash(true);
      setTimeout(() => {
        setActiveIndex(index);
        setPhase('burn-in');
        setTimeout(() => {
          setPhase('idle');
          setShowFlash(false);
        }, 500);
      }, 400);
    },
    [activeIndex, phase, groups.length],
  );

  /* ── Keyboard navigation ───────────────────────────────── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedVideo) return;
      if (e.key === 'ArrowRight') navigateTo(activeIndex + 1);
      if (e.key === 'ArrowLeft') navigateTo(activeIndex - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, navigateTo, selectedVideo]);

  const handleSelect = useCallback((video: VideoEntry) => {
    setSelectedVideo(video);
  }, []);

  /* ── Transition class ──────────────────────────────────── */
  const transitionClass =
    phase === 'burn-out'
      ? 'diary-burn-out'
      : phase === 'burn-in'
        ? 'diary-burn-in'
        : '';

  return (
    <div className="relative h-screen overflow-hidden bg-ink">
      <style>{styles}</style>

      {/* ── Film burn flash overlay ────────────────────── */}
      <div
        className={`fixed inset-0 z-25 pointer-events-none ${showFlash ? 'diary-flash-active' : 'opacity-0'}`}
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(241,169,58,0.5), rgba(245,240,232,0.15) 50%, transparent 75%)' }}
      />

      {/* ── Scan lines (full-screen overlay) ─────────────── */}
      <div className="fixed inset-0 z-20 pointer-events-none diary-scanlines" />

      {/* ── Active project section ────────────────────────── */}
      <div className={`h-full ${transitionClass} ${choreo}`}>
        <ProjectSection
          group={activeGroup}
          index={activeIndex}
          total={groups.length}
          onSelect={handleSelect}
        />
      </div>

      {/* ── Side arrow: Previous ─────────────────────────── */}
      {activeIndex > 0 && (
        <button
          onClick={() => navigateTo(activeIndex - 1)}
          aria-label="Proyecto anterior"
          className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/10 bg-ink/50 backdrop-blur-sm flex items-center justify-center text-bone/60 hover:text-ember hover:border-ember/40 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* ── Side arrow: Next ─────────────────────────────── */}
      {activeIndex < groups.length - 1 && (
        <button
          onClick={() => navigateTo(activeIndex + 1)}
          aria-label="Siguiente proyecto"
          className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/10 bg-ink/50 backdrop-blur-sm flex items-center justify-center text-bone/60 hover:text-ember hover:border-ember/40 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* ── Bottom project navigation ────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-ink/80 backdrop-blur-md border-t border-white/5">
        <div className="flex items-center justify-center gap-1 md:gap-2 px-4 py-3 overflow-x-auto no-scrollbar max-w-[1920px] mx-auto">
          {groups.map((g, i) => (
            <button
              key={g.slug}
              onClick={() => navigateTo(i)}
              className={`shrink-0 px-3 md:px-4 py-1.5 text-[10px] md:text-xs uppercase tracking-[0.12em] rounded-full border transition-all duration-200 ${
                i === activeIndex
                  ? 'bg-ember/15 border-ember/40 text-ember font-semibold'
                  : 'border-transparent text-fog/50 hover:text-bone hover:border-white/10'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Video modal ──────────────────────────────────── */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          playlist={activeGroup.videos}
          onClose={() => setSelectedVideo(null)}
          onNavigate={setSelectedVideo}
        />
      )}
    </div>
  );
}
