'use client';

import type { VideoEntry } from '@/data/diary';
import VideoCard from './VideoCard';

interface DiaryMasonryProps {
  videos: VideoEntry[];
  onSelect: (video: VideoEntry) => void;
}

export default function DiaryMasonry({ videos, onSelect }: DiaryMasonryProps) {
  if (videos.length === 0) return null;

  return (
    <div className="px-6 md:px-12 lg:px-20 max-w-[1920px] mx-auto">
      {/* ── Section header ──────────────────────────────────── */}
      <div className="mb-8 flex items-end gap-4">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-bone">
          Todo el trabajo
        </h2>
        <span className="text-xs text-fog/50 tracking-wide mb-1">
          {videos.length} {videos.length === 1 ? 'pieza' : 'piezas'}
        </span>
      </div>

      {/* ── CSS columns masonry ─────────────────────────────── */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 [column-fill:_balance]">
        {videos.map((video, idx) => (
          <div key={video.base} className="break-inside-avoid mb-5">
            <VideoCard
              video={video}
              index={idx}
              onClick={() => onSelect(video)}
              masonry
            />
          </div>
        ))}
      </div>
    </div>
  );
}
