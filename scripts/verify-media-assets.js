#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const alwaysRequiredFiles = [
  "public/paquetes/pack-campaign.mp4",
  "public/paquetes/pack-monthly.mp4",
  "public/paquetes/pack-alacarte.mp4",
  "public/textures/humo-3-hq.mp4",
  "public/textures/humo-3-opt.mp4"
];

const diaryVideoFiles = [
  "public/videos/previews/ARREGLANDO_HORNO_FRATELLI_PAZZI-preview.mp4",
  "public/videos/previews/EDIT_CRUJIDO_PIZZA_FRATELLI_PAZZI_v2-preview.mp4",
  "public/videos/previews/EDIT_INICIAL_L_FRATELLI_PAZZI_v2-preview.mp4",
  "public/videos/previews/EDIT_REEL_FRATELLI_PAZZI_PROMO_CABRAMELIZADA_V1-preview.mp4",
  "public/videos/previews/EDIT_TIMELAPSE_PIZZA_FRATELLI_PAZZI_v2-preview.mp4",
  "public/videos/full/ARREGLANDO_HORNO_FRATELLI_PAZZI-full.mp4",
  "public/videos/full/EDIT_CRUJIDO_PIZZA_FRATELLI_PAZZI_v2-full.mp4",
  "public/videos/full/EDIT_INICIAL_L_FRATELLI_PAZZI_v2-full.mp4",
  "public/videos/full/EDIT_REEL_FRATELLI_PAZZI_PROMO_CABRAMELIZADA_V1-full.mp4",
  "public/videos/full/EDIT_TIMELAPSE_PIZZA_FRATELLI_PAZZI_v2-full.mp4"
];

const videoCdn = (process.env.NEXT_PUBLIC_VIDEO_CDN || "").trim();
const validateDiaryVideosLocally = !videoCdn;
const requiredFiles = validateDiaryVideosLocally
  ? [...alwaysRequiredFiles, ...diaryVideoFiles]
  : alwaysRequiredFiles;

const missing = [];
const empty = [];

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(absolutePath)) {
    missing.push(relativePath);
    continue;
  }

  const stat = fs.statSync(absolutePath);
  if (!stat.isFile() || stat.size <= 0) {
    empty.push(relativePath);
  }
}

if (missing.length || empty.length) {
  console.error("Media verification failed.");
  if (missing.length) {
    console.error("Missing files:");
    for (const file of missing) {
      console.error(` - ${file}`);
    }
  }
  if (empty.length) {
    console.error("Empty files:");
    for (const file of empty) {
      console.error(` - ${file}`);
    }
  }
  process.exit(1);
}

if (!validateDiaryVideosLocally) {
  console.log(`Diary videos are served from CDN (${videoCdn}); skipped local public/videos checks.`);
}

console.log(`Media verification passed (${requiredFiles.length} files).`);
