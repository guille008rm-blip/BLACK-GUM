"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export interface PackSelectorItem {
  id: string;
  key: string;
  title: string;
  imageSrc: string;
  videoSrc?: string;
  alt: string;
  tagline?: string;
}

interface PackSelectorProps {
  packs: PackSelectorItem[];
  initialKey: string;
  onSectionSelect?: (sectionKey: string, scrollTo?: boolean) => void;
}

function rotateToCenter(packs: PackSelectorItem[], key: string) {
  if (packs.length !== 3) return packs.slice(0, 3);
  const index = packs.findIndex((pack) => pack.key === key);
  if (index === 1 || index === -1) return packs;
  if (index === 0) return [packs[2], packs[0], packs[1]];
  return [packs[1], packs[2], packs[0]];
}

export default function PackSelector({ packs, initialKey, onSectionSelect }: PackSelectorProps) {
  const router = useRouter();
  const [order, setOrder] = useState<PackSelectorItem[]>(() =>
    rotateToCenter(packs, initialKey)
  );
  const [isMounted, setIsMounted] = useState(false);
  const [puff, setPuff] = useState(false);
  const [isShifting, setIsShifting] = useState(false);
  const shiftTimeoutRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const smokePrimaryRef = useRef<HTMLVideoElement>(null);
  const videoRefsMap = useRef<Map<string, HTMLVideoElement>>(new Map());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setOrder((prev) => {
      const next = rotateToCenter(packs, initialKey);
      if (prev[1]?.key === next[1]?.key) return prev;
      return next;
    });
  }, [packs, initialKey]);

  const centerPack = order[1] ?? order[0];

  useEffect(() => {
    if (!centerPack) return;
    setPuff(true);
    const timeout = setTimeout(() => setPuff(false), 420);
    return () => clearTimeout(timeout);
  }, [centerPack?.id]);

  useEffect(() => {
    const primary = smokePrimaryRef.current;
    if (!primary) return;

    const handleTime = () => {
      const duration = primary.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      if (primary.currentTime >= duration - 0.04) {
        primary.currentTime = 0;
        primary.play().catch(() => undefined);
      }
    };

    primary.addEventListener("timeupdate", handleTime);
    return () => primary.removeEventListener("timeupdate", handleTime);
  }, []);

  useEffect(() => {
    return () => {
      if (shiftTimeoutRef.current) {
        window.clearTimeout(shiftTimeoutRef.current);
      }
    };
  }, []);

  // Handle pack video autoplay
  useEffect(() => {
    if (!centerPack) return;
    
    // Play center video, pause side videos
    videoRefsMap.current.forEach((videoEl, packId) => {
      if (packId === centerPack.id) {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {});
      } else if (!videoEl.paused) {
        videoEl.pause();
      }
    });
  }, [centerPack?.id, centerPack?.videoSrc]);

  const pushSelection = (packKey: string, scrollTo = false) => {
    if (onSectionSelect) {
      onSectionSelect(packKey, scrollTo);
    }
    router.push(`/packs?section=${packKey}`, { scroll: false });
  };

  const rotateRight = () => {
    if (isShifting) return;
    setIsShifting(true);
    if (shiftTimeoutRef.current) {
      window.clearTimeout(shiftTimeoutRef.current);
    }
    setOrder((prev) => {
      const next = [prev[1], prev[2], prev[0]];
      pushSelection(next[1].key, false);
      return next;
    });
    shiftTimeoutRef.current = window.setTimeout(() => setIsShifting(false), 520);
  };

  const rotateLeft = () => {
    if (isShifting) return;
    setIsShifting(true);
    if (shiftTimeoutRef.current) {
      window.clearTimeout(shiftTimeoutRef.current);
    }
    setOrder((prev) => {
      const next = [prev[2], prev[0], prev[1]];
      pushSelection(next[1].key, false);
      return next;
    });
    shiftTimeoutRef.current = window.setTimeout(() => setIsShifting(false), 520);
  };

  const handleCardClick = (index: number) => {
    if (index === 1) {
      pushSelection(order[1].key, true);
      return;
    }
    if (index === 0) {
      rotateLeft();
      return;
    }
    rotateRight();
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName ?? "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        rotateLeft();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        rotateRight();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* Wheel hijacking removed — it was intercepting normal page scroll
     and causing erratic jumps. Users can still rotate cards via arrows,
     clicks, and keyboard. */

  const titleParts = useMemo(() => {
    if (!centerPack) return { base: "", accent: "" };
    const words = centerPack.title.split(" ").filter(Boolean);
    const accent = words.pop() ?? "";
    const base = words.join(" ");
    return { base, accent };
  }, [centerPack]);

  return (
    <div className="pack-selector">
      <div className={`pack-smoke ${puff ? "is-puff" : ""}`} aria-hidden="true">
        <video
          ref={smokePrimaryRef}
          className="pack-smoke-video"
          autoPlay
          muted
          playsInline
          preload="none"
          poster="/textures/humo-3.jpg"
        >
          <source
            src="/textures/humo-3-hq.mp4"
            type="video/mp4"
            media="(min-width: 1024px)"
          />
          <source src="/textures/humo-3-opt.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="pack-selector-title">
        {centerPack && (
          <div key={centerPack.id} className="pack-title">
            {titleParts.base ? <span className="text-bone">{titleParts.base} </span> : null}
            <span className="text-ember">{titleParts.accent}</span>
          </div>
        )}
      </div>

      <div
        ref={stageRef}
        className={`pack-selector-stage ${isShifting ? "is-shifting" : ""}`}
      >
        {order.map((pack, index) => {
          const slot =
            index === 0 ? "left" : index === 1 ? "center" : "right";
          return (
          <button
            key={pack.id}
            type="button"
            className={`pack-card slot-${slot} ${isMounted ? "is-enter" : ""}`}
            style={{ animationDelay: `${index * 0.18}s` }}
            onClick={() => handleCardClick(index)}
            aria-label={`Seleccionar ${pack.title}`}
          >
            <div
              className="pack-card-media"
              style={{ ["--pack-image" as any]: `url(${pack.imageSrc})` }}
            >
              <div className="pack-image-frame">
                {pack.videoSrc ? (
                  <video
                    ref={(el) => {
                      if (el) {
                        videoRefsMap.current.set(pack.id, el);
                      }
                    }}
                    src={pack.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster={pack.imageSrc}
                    className="pack-image"
                    style={{ objectFit: "cover", width: "100%", height: "100%", position: "absolute", inset: 0 }}
                  />
                ) : (
                  <Image
                    src={pack.imageSrc}
                    alt={pack.alt}
                    fill
                    sizes="(max-width: 768px) 30vw, (max-width: 1200px) 22vw, 18vw"
                    className="pack-image"
                    priority={index === 1}
                  />
                )}
              </div>
            </div>
          </button>
          );
        })}

        <button
          type="button"
          onClick={rotateLeft}
          className="pack-nav pack-nav-left"
          aria-label="Anterior paquete"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={rotateRight}
          className="pack-nav pack-nav-right"
          aria-label="Siguiente paquete"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
