'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

interface VideoEntry {
  title: string;
  base: string;
  description: string;
  date: string;
}

const videos: VideoEntry[] = [
  {
    title: 'Arreglando horno Fratelli Pazzi',
    base: 'ARREGLANDO_HORNO_FRATELLI_PAZZI',
    description: 'Proceso de arreglo y mantenimiento del horno tradicional',
    date: '2025'
  },
  {
    title: 'Crujido de pizza - edición final',
    base: 'EDIT_CRUJIDO_PIZZA_FRATELLI_PAZZI_v2',
    description: 'Captura del momento perfecto del crujido de la pizza',
    date: '2025'
  },
  {
    title: 'Intro Fratelli Pazzi',
    base: 'EDIT_INICIAL_L_FRATELLI_PAZZI_v2',
    description: 'Secuencia introductoria del proyecto Fratelli Pazzi',
    date: '2025'
  },
  {
    title: 'Promo Cabramelizada',
    base: 'EDIT_REEL_FRATELLI_PAZZI_PROMO_CABRAMELIZADA_V1',
    description: 'Reel promocional con énfasis en nuestro toque especial',
    date: '2025'
  },
  {
    title: 'Timelapse pizza',
    base: 'EDIT_TIMELAPSE_PIZZA_FRATELLI_PAZZI_v2',
    description: 'Timelapse del proceso de creación de pizza',
    date: '2025'
  }
];

/* ─── Optimised inline styles (lighter glow, GPU-friendly) ─── */
const styles = `
  @keyframes scaleUp {
    from { transform: scale(1); }
    to   { transform: scale(1.05); }
  }

  .video-scale-up {
    animation: scaleUp 0.6s ease-out forwards;
    will-change: transform;
  }

  @keyframes borderGlow {
    0%, 100% {
      box-shadow: 0 0 14px 2px rgba(255, 152, 70, 0.7);
    }
    50% {
      box-shadow: 0 0 22px 6px rgba(255, 152, 70, 0.85);
    }
  }

  .video-playing {
    animation: borderGlow 3s ease-in-out infinite;
    border: 2px solid rgba(255, 255, 255, 0.9);
    will-change: box-shadow;
  }

  /* fade-in for cards entering viewport */
  .diary-card-hidden {
    opacity: 0;
    transform: translateY(24px);
  }
  .diary-card-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }
`;

/* ─── Throttle helper (avoids rapid re-fires on mouse events) ─── */
function useThrottledCallback(
  fn: (base: string) => void,
  delay: number
): (base: string) => void {
  const lastCall = useRef(0);
  return useCallback(
    (base: string) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        fn(base);
      }
    },
    [fn, delay]
  );
}

export default function ProductionDiary() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  /* ─── Intersection Observer: lazy-load videos only when near viewport ─── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const base = entry.target.getAttribute('data-video-base');
          if (!base) return;

          setVisibleCards((prev) => {
            const next = new Set(prev);
            if (entry.isIntersecting) {
              next.add(base);
              // Start preloading metadata when card enters viewport
              const vid = videoRefs.current[base];
              if (vid && vid.preload === 'none') {
                vid.preload = 'metadata';
              }
            } else {
              // Pause videos that scroll out of view
              const vid = videoRefs.current[base];
              if (vid && !vid.paused) {
                vid.pause();
                vid.currentTime = 0;
              }
            }
            return next;
          });
        });
      },
      { rootMargin: '200px 0px', threshold: 0.1 }
    );

    Object.values(cardRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* ─── Modal open/close: lock scroll & blur header ─── */
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = 'hidden';
      const header = document.querySelector('header');
      if (header) header.style.filter = 'blur(8px)';
    } else {
      document.body.style.overflow = 'auto';
      const header = document.querySelector('header');
      if (header) header.style.filter = 'blur(0px)';
    }
    return () => {
      document.body.style.overflow = 'auto';
      const header = document.querySelector('header');
      if (header) header.style.filter = 'blur(0px)';
    };
  }, [selectedVideo]);

  /* ─── Throttled hover handlers (max 1 per 150 ms) ─── */
  const handleMouseEnter = useThrottledCallback((base: string) => {
    const vid = videoRefs.current[base];
    if (vid && vid.paused) {
      vid.play().catch(() => {});
    }
  }, 150);

  const handleMouseLeave = useCallback((base: string) => {
    const vid = videoRefs.current[base];
    if (vid) {
      vid.pause();
      vid.currentTime = 0;
    }
  }, []);

  return (
    <>
      <style>{styles}</style>
      <Section spacing="lg" variant="dark" className="production-diary-surface">
        <Container maxWidth="xl">
          <div className="mb-12">
            <div className="mx-auto max-w-[920px] text-center">
              <p className="text-[11px] uppercase tracking-[0.35em] text-ember font-semibold">
                EN DIARIO, <span className="text-bone/70">ESTUDIO</span>
              </p>
              <h1 className="mt-3 text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] text-bone drop-shadow-lg">
                Hazlo realidad
              </h1>
              <div className="mt-5 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-ember/70" />
                <p className="max-w-xl text-fog text-sm md:text-base leading-relaxed font-light">
                  Cada cuadro cuenta una historia. Estas son las nuestras.
                </p>
                <span className="h-px w-10 bg-ember/70" />
              </div>
            </div>
          </div>

          <div className={`flex flex-wrap justify-center gap-6 mb-8 transition-all duration-600 ${selectedVideo ? 'blur-md' : ''}`}>
            {videos.map((video, index) => (
              <div
                key={video.base}
                ref={(el) => { cardRefs.current[video.base] = el; }}
                data-video-base={video.base}
                className={`group cursor-pointer transition-transform duration-300 hover:scale-105 ${selectedVideo === video.base ? 'video-scale-up' : ''} ${visibleCards.has(video.base) ? 'diary-card-visible' : 'diary-card-hidden'}`}
                onClick={() => setSelectedVideo(video.base)}
                onMouseEnter={() => handleMouseEnter(video.base)}
                onMouseLeave={() => handleMouseLeave(video.base)}
                style={{
                  width: '300px',
                  height: '533px',
                  transitionDelay: `${index * 80}ms`
                }}
              >
                <div className="relative overflow-hidden rounded-lg video-card-surface border border-white/10 group-hover:border-ember group-hover:shadow-[0_0_20px_rgba(255,152,70,0.6)] transition-all duration-300 w-full h-full">
                  <div className="video-card-inner flex items-center justify-center relative overflow-hidden w-full h-full">
                    {/* Poster image shown immediately; video rendered only when near viewport */}
                    {visibleCards.has(video.base) ? (
                      <video
                        ref={(el) => { videoRefs.current[video.base] = el; }}
                        src={`/videos/previews/${video.base}-preview.mp4`}
                        poster={`/videos/posters/${video.base}.jpg`}
                        preload="none"
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      /* Lightweight poster placeholder until card enters viewport */
                      <img
                        src={`/videos/posters/${video.base}.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-br from-ember/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedVideo && (
            <>
              <div
                className="fixed inset-0 z-40"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
                onClick={() => setSelectedVideo(null)}
              />

              <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div
                  className="relative pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '300px',
                    height: '533px'
                  }}
                >
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="absolute -top-12 right-0 text-bone hover:text-ember transition-colors z-10"
                    aria-label="Cerrar video"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <div
                    className="relative overflow-hidden rounded-lg video-card-surface w-full h-full video-playing"
                    style={{
                      boxShadow: '0 0 50px 20px rgba(255, 152, 70, 0.4), 0 0 100px 40px rgba(255, 152, 70, 0.15)'
                    }}
                  >
                    <video
                      key={selectedVideo}
                      src={`/videos/full/${selectedVideo}-full.mp4`}
                      poster={`/videos/posters/${selectedVideo}.jpg`}
                      controls
                      autoPlay
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
