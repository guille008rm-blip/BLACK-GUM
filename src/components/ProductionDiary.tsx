'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  videos,
  groupByProject,
  getFeaturedVideo,
  getProjectNames,
} from '@/data/diary';
import type { VideoEntry } from '@/data/diary';

import DiaryHero from '@/components/diary/DiaryHero';
import ProjectFilter from '@/components/diary/ProjectFilter';
import ProjectRow from '@/components/diary/ProjectRow';
import DiaryMasonry from '@/components/diary/DiaryMasonry';
import VideoModal from '@/components/diary/VideoModal';

/* ─── Inline keyframe styles (kept lightweight) ───────────── */
const styles = `
  .diary-card-hidden {
    opacity: 0;
    transform: translateY(24px);
  }
  .diary-card-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }

  /* Hide native scrollbar on horizontal rows */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

export default function ProductionDiary() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoEntry | null>(null);

  /* ── Derived data ──────────────────────────────────────── */
  const featuredVideo = useMemo(() => getFeaturedVideo(videos), []);
  const projectNames = useMemo(() => getProjectNames(videos), []);
  const groups = useMemo(() => groupByProject(videos), []);

  const filteredGroups = useMemo(
    () =>
      activeProject
        ? groups.filter((g) => g.name === activeProject)
        : groups,
    [activeProject, groups]
  );

  const allFilteredVideos = useMemo(
    () =>
      activeProject
        ? videos.filter((v) => v.project === activeProject)
        : videos,
    [activeProject]
  );

  /* ── Handlers ──────────────────────────────────────────── */
  const handleSelect = useCallback((video: VideoEntry) => {
    setSelectedVideo(video);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  const handleModalNavigate = useCallback((video: VideoEntry) => {
    setSelectedVideo(video);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* ── 1. Hero ──────────────────────────────────────── */}
      <DiaryHero video={featuredVideo} />

      {/* ── 2. Project filter bar (sticky) ───────────────── */}
      <ProjectFilter
        projects={projectNames}
        active={activeProject}
        onChange={setActiveProject}
      />

      {/* ── 3. Project rows (Netflix-style) ──────────────── */}
      <section className="pt-10 pb-4">
        {filteredGroups.map((group) => (
          <ProjectRow
            key={group.slug}
            group={group}
            onSelect={handleSelect}
          />
        ))}
      </section>

      {/* ── 4. Masonry grid — "Todo el trabajo" ──────────── */}
      <section className="pb-20">
        <DiaryMasonry
          videos={allFilteredVideos}
          onSelect={handleSelect}
        />
      </section>

      {/* ── 5. Video modal ───────────────────────────────── */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          playlist={allFilteredVideos}
          onClose={handleModalClose}
          onNavigate={handleModalNavigate}
        />
      )}
    </>
  );
}
