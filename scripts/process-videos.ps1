<# ─────────────────────────────────────────────────────────────
   Black Gum — Video processing pipeline (quality-first)
   
   Generates: /videos/full/   → High-quality H.264 (CRF 18)
              /videos/previews/ → First 6s clip, same resolution (CRF 20)
              /videos/posters/  → Best-frame JPEG (q:v 2)
   ───────────────────────────────────────────────────────────── #>

$ErrorActionPreference = 'Stop'

$srcRoot  = 'C:\Users\guill\Desktop\MTL BLACKGUM\VIDEOS BLCKGUM'
$dstRoot  = 'C:\Users\guill\Desktop\WEB JAUME\public\videos'

# Ensure output dirs exist
@('full', 'previews', 'posters') | ForEach-Object {
    $dir = Join-Path $dstRoot $_
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
}

# ─── Video manifest ─────────────────────────────────────────
# base: sanitised filename used in code,  src: relative path from $srcRoot
$manifest = @(
    # ── Clínica Barragán ──────────────────────────────────
    @{ base = 'CB_REEL_BRAQUIOPLASTIA';           src = 'CLINICA BARRAGAN\VIDEO\REEL BRAQUIOPLASTIA VIDEO FINAL v2.mp4' }
    @{ base = 'CB_REEL_CAPILAR';                   src = 'CLINICA BARRAGAN\VIDEO\REEL CAPILAR VIDEO.mp4' }
    @{ base = 'CB_REEL_FUTURISTA';                 src = 'CLINICA BARRAGAN\VIDEO\REEL_FUTURISTA_V2.mp4' }
    @{ base = 'CB_VISUALIZER_SECOND_SKIN';         src = 'CLINICA BARRAGAN\VIDEO\VISUALIZER SECOND SKIN CAUCASICA OK v1.mp4' }
    @{ base = 'CB_VISUALIZER_MANCHAS';             src = 'CLINICA BARRAGAN\VIDEO\VISUALIZER_MANCHAS V1.mp4' }
    @{ base = 'CB_VISUALIZER_REJUVENECIMIENTO';    src = 'CLINICA BARRAGAN\VIDEO\VISUALIZER_REJUVENECIMIENTO V1.mp4' }

    # ── Música — Midas Alonso ─────────────────────────────
    @{ base = 'MIDAS_CONDOR';                      src = 'videos 1\COLOR GRADE_VISUALIZER CONDOR-MIDAS ALONSO.mp4' }
    @{ base = 'MIDAS_LLANTOS_Y_ORTIGAS';           src = 'videos 1\COLOR GRADE_VISUALIZER LLANTOS Y ORTIGAS-MIDAS ALONSO.mp4' }

    # ── Cortometrajes ─────────────────────────────────────
    @{ base = 'CORTO_JUAN_CABALLO';                src = 'videos 1\COLOR GRADE_VISUALIZER CORTO JUAN CABALLO.mp4' }
    @{ base = 'CORTO_MANOLITO';                    src = 'videos 1\MONTAJE_VISUALIZER CORTO YO PUDE SER MANOLITO.mp4' }

    # ── Corporativo ───────────────────────────────────────
    @{ base = 'CORP_DCYCLE';                       src = 'videos 1\FULL PACK_VISUALIZER CORPORATIVO DCYCLE.mp4' }
    @{ base = 'CORP_GRUPOTOLEDO';                  src = 'videos 1\FULL PACK_VISUALIZER CORPORATIVO GRUPOTOLEDO.mp4' }
    @{ base = 'CORP_GRUPOTOLEDO_PILDORAS';         src = 'videos 1\FULL PACK_VISUALIZER_PILDORAS_GRUPOTOLEDO.mp4' }
    @{ base = 'CORP_GRUPOTOLEDO_REELS';            src = 'videos 1\FULL PACK_VISUALIZER_REELS_GRUPOTOLEDO.mp4' }
    @{ base = 'CORP_FREZYDERM_REELS';              src = 'videos 1\FULL PACK_VISUALIZER_REELS_FREZYDERM.mp4' }

    # ── Música — Artistas varios ──────────────────────────
    @{ base = 'MARINA_DOS_EXTRANOS';               src = 'videos 1\FULL PACK_VISUALIZER DOS EXTRAÑOS (Live Session)-MARINA RECHE.mp4' }
    @{ base = 'MARINA_POR_SI_QUIERES_VOLVER';      src = 'videos 1\FULL PACK_VISUALIZER POR SI QUIERES VOLVER (Live Session)-MARINA RECHE.mp4' }
    @{ base = 'PANTE_FALTA_ALGO';                  src = 'videos 1\FULL PACK_VISUALIZER FALTA ALGO-PANTE.mp4' }
    @{ base = 'JDOSE_INMORTALES';                  src = 'videos 1\FULL PACK_VISUALIZER INMORTALES-JDOSE ft ALBERDI.mp4' }
    @{ base = 'TRAYLOU_VIBORA';                    src = 'videos 1\FULL PACK_VISUALIZER VÍBORA-TRAYLOU.mp4' }
    @{ base = 'PODCAST_MELOMANIA';                 src = 'FULL PACK_VISUALIZER PODCAST MELOMANIA.mp4' }

    # ── Eventos ───────────────────────────────────────────
    @{ base = 'VULKAN_PARTY_PROMO';                src = 'videos 1\MONTAJE Y COLOR_VISUALIZER_REELS_PROMO_VULKAN PARTY.mp4' }
)

$total = $manifest.Count
$i = 0

foreach ($entry in $manifest) {
    $i++
    $base = $entry.base
    $srcFile = Join-Path $srcRoot $entry.src

    if (-not (Test-Path $srcFile)) {
        Write-Host "[$i/$total] SKIP (not found): $($entry.src)" -ForegroundColor Yellow
        continue
    }

    $fullOut    = Join-Path $dstRoot "full\$base-full.mp4"
    $previewOut = Join-Path $dstRoot "previews\$base-preview.mp4"
    $posterOut  = Join-Path $dstRoot "posters\$base.jpg"

    Write-Host "`n[$i/$total] Processing: $base" -ForegroundColor Cyan

    # ── 1. Full quality encode (CRF 18 = near-lossless, fast preset for speed) ──
    if (-not (Test-Path $fullOut)) {
        Write-Host "  → Full (CRF 18, H.264)..." -ForegroundColor White
        ffmpeg -hide_banner -loglevel warning -i $srcFile `
            -c:v libx264 -crf 18 -preset slow -tune film `
            -c:a aac -b:a 192k `
            -movflags +faststart `
            -y $fullOut
    } else {
        Write-Host "  → Full already exists, skipping" -ForegroundColor DarkGray
    }

    # ── 2. Preview clip (first 6 seconds, CRF 20, same resolution) ──
    if (-not (Test-Path $previewOut)) {
        Write-Host "  → Preview (6s, CRF 20)..." -ForegroundColor White
        ffmpeg -hide_banner -loglevel warning -i $srcFile `
            -t 6 -an `
            -c:v libx264 -crf 20 -preset slow -tune film `
            -movflags +faststart `
            -y $previewOut
    } else {
        Write-Host "  → Preview already exists, skipping" -ForegroundColor DarkGray
    }

    # ── 3. Poster — extract frame at 1 second (high-quality JPEG) ──
    if (-not (Test-Path $posterOut)) {
        Write-Host "  → Poster (JPEG q2)..." -ForegroundColor White
        ffmpeg -hide_banner -loglevel warning -i $srcFile `
            -ss 1 -frames:v 1 `
            -q:v 2 `
            -y $posterOut
    } else {
        Write-Host "  → Poster already exists, skipping" -ForegroundColor DarkGray
    }
}

Write-Host "`n✔ Pipeline complete — $total videos processed." -ForegroundColor Green
