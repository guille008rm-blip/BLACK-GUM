'use client';

import Image from 'next/image';

/**
 * Animated loader shown while the Diary page assets are loading.
 * Uses the brand logo with a subtle pulse + glow animation.
 * Pure CSS — no external dependencies.
 */
export default function DiaryLoader() {
  return (
    <div className="diary-loader">
      <div className="diary-loader__ring" />
      <Image
        src="/brand/logo-white.png"
        alt="Black Gum"
        width={80}
        height={80}
        priority
        className="diary-loader__logo"
      />
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

  .diary-loader__logo {
    position: relative;
    z-index: 2;
    animation: loaderPulse 1.6s ease-in-out infinite;
    filter: drop-shadow(0 0 18px rgba(241, 169, 58, 0.5));
  }

  .diary-loader__ring {
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #f1a93a;
    border-right-color: rgba(241, 169, 58, 0.3);
    animation: loaderSpin 1s linear infinite;
    z-index: 1;
  }

  @keyframes loaderPulse {
    0%, 100% {
      opacity: 0.7;
      transform: scale(1);
      filter: drop-shadow(0 0 12px rgba(241, 169, 58, 0.3));
    }
    50% {
      opacity: 1;
      transform: scale(1.06);
      filter: drop-shadow(0 0 24px rgba(241, 169, 58, 0.65));
    }
  }

  @keyframes loaderSpin {
    to {
      transform: rotate(360deg);
    }
  }
`;
