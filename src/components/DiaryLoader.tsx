'use client';

import { useRef, useCallback } from 'react';

interface DiaryLoaderProps {
  /** Called when the intro should be dismissed */
  onDismiss: () => void;
  /** If true the page is ready — video will end after current playback. If false, video loops. */
  pageReady: boolean;
}

/**
 * Full-screen intro overlay for the Diary page.
 * Always plays the Remotion-rendered logo animation.
 * Loops while the page is loading; plays to end once ready.
 */
export default function DiaryLoader({ onDismiss, pageReady }: DiaryLoaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasPlayedOnce = useRef(false);

  const handleEnded = useCallback(() => {
    hasPlayedOnce.current = true;
    if (pageReady) {
      onDismiss();
    } else {
      // Page still loading — loop
      const vid = videoRef.current;
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    }
  }, [pageReady, onDismiss]);

  return (
    <div className="diary-loader">
      <video
        ref={videoRef}
        className="diary-loader__video"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleEnded}
      >
        <source src={`${process.env.NEXT_PUBLIC_VIDEO_CDN || '/videos'}/diary-loader.webm`} type="video/webm" />
        <source src={`${process.env.NEXT_PUBLIC_VIDEO_CDN || '/videos'}/diary-loader.mp4`} type="video/mp4" />
      </video>
      <style>{loaderStyles}</style>
    </div>
  );
}

const loaderStyles = `
  .diary-loader {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0b0b0b;
  }

  .diary-loader__video {
    width: 100vw;
    height: 100vh;
    object-fit: contain;
  }
`;
