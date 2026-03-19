@echo off
setlocal enabledelayedexpansion

set "SRC=C:\Users\guill\Desktop\MTL BLACKGUM\VIDEOS BLCKGUM"
set "DST=C:\Users\guill\Desktop\WEB JAUME\public\videos"

mkdir "%DST%\full" 2>nul
mkdir "%DST%\previews" 2>nul
mkdir "%DST%\posters" 2>nul

REM ── Helper: process(base, srcRelPath) ──────────────────────
REM Processes a single video: full encode + preview clip + poster

REM ── Clinica Barragan ───────────────────────────────────────
call :proc "CB_REEL_BRAQUIOPLASTIA"        "CLINICA BARRAGAN\VIDEO\REEL BRAQUIOPLASTIA VIDEO FINAL v2.mp4"
call :proc "CB_REEL_CAPILAR"               "CLINICA BARRAGAN\VIDEO\REEL CAPILAR VIDEO.mp4"
call :proc "CB_REEL_FUTURISTA"             "CLINICA BARRAGAN\VIDEO\REEL_FUTURISTA_V2.mp4"
call :proc "CB_VISUALIZER_SECOND_SKIN"     "CLINICA BARRAGAN\VIDEO\VISUALIZER SECOND SKIN CAUCASICA OK v1.mp4"
call :proc "CB_VISUALIZER_MANCHAS"         "CLINICA BARRAGAN\VIDEO\VISUALIZER_MANCHAS V1.mp4"
call :proc "CB_VISUALIZER_REJUVENECIMIENTO" "CLINICA BARRAGAN\VIDEO\VISUALIZER_REJUVENECIMIENTO V1.mp4"

REM ── Musica - Midas Alonso ──────────────────────────────────
call :proc "MIDAS_CONDOR"                  "videos 1\COLOR GRADE_VISUALIZER CONDOR-MIDAS ALONSO.mp4"
call :proc "MIDAS_LLANTOS_Y_ORTIGAS"       "videos 1\COLOR GRADE_VISUALIZER LLANTOS Y ORTIGAS-MIDAS ALONSO.mp4"

REM ── Cortometrajes ──────────────────────────────────────────
call :proc "CORTO_JUAN_CABALLO"            "videos 1\COLOR GRADE_VISUALIZER CORTO JUAN CABALLO.mp4"
call :proc "CORTO_MANOLITO"                "videos 1\MONTAJE_VISUALIZER CORTO YO PUDE SER MANOLITO.mp4"

REM ── Corporativo ────────────────────────────────────────────
call :proc "CORP_DCYCLE"                   "videos 1\FULL PACK_VISUALIZER CORPORATIVO DCYCLE.mp4"
call :proc "CORP_GRUPOTOLEDO"              "videos 1\FULL PACK_VISUALIZER CORPORATIVO GRUPOTOLEDO.mp4"
call :proc "CORP_GRUPOTOLEDO_PILDORAS"     "videos 1\FULL PACK_VISUALIZER_PILDORAS_GRUPOTOLEDO.mp4"
call :proc "CORP_GRUPOTOLEDO_REELS"        "videos 1\FULL PACK_VISUALIZER_REELS_GRUPOTOLEDO.mp4"
call :proc "CORP_FREZYDERM_REELS"          "videos 1\FULL PACK_VISUALIZER_REELS_FREZYDERM.mp4"

REM ── Musica - Artistas varios ───────────────────────────────
call :proc "MARINA_DOS_EXTRANOS"           "videos 1\FULL PACK_VISUALIZER DOS EXTRA\u00D1OS (Live Session)-MARINA RECHE.mp4"
call :proc "MARINA_POR_SI_QUIERES_VOLVER"  "videos 1\FULL PACK_VISUALIZER POR SI QUIERES VOLVER (Live Session)-MARINA RECHE.mp4"
call :proc "PANTE_FALTA_ALGO"              "videos 1\FULL PACK_VISUALIZER FALTA ALGO-PANTE.mp4"
call :proc "JDOSE_INMORTALES"              "videos 1\FULL PACK_VISUALIZER INMORTALES-JDOSE ft ALBERDI.mp4"
call :proc "TRAYLOU_VIBORA"                "videos 1\FULL PACK_VISUALIZER V\u00CDBORA-TRAYLOU.mp4"
call :proc "PODCAST_MELOMANIA"             "FULL PACK_VISUALIZER PODCAST MELOMANIA.mp4"

REM ── Eventos ────────────────────────────────────────────────
call :proc "VULKAN_PARTY_PROMO"            "videos 1\MONTAJE Y COLOR_VISUALIZER_REELS_PROMO_VULKAN PARTY.mp4"

echo.
echo [DONE] All videos processed.
pause
goto :eof

:proc
set "BASE=%~1"
set "SRCFILE=%SRC%\%~2"

if not exist "%SRCFILE%" (
    echo [SKIP] Not found: %~2
    goto :eof
)

echo.
echo [PROCESSING] %BASE%

REM ── Full quality (CRF 18, H.264 slow, film tune) ──────────
if not exist "%DST%\full\%BASE%-full.mp4" (
    echo   Full CRF18...
    ffmpeg -hide_banner -loglevel warning -i "%SRCFILE%" -c:v libx264 -crf 18 -preset slow -tune film -c:a aac -b:a 192k -movflags +faststart -y "%DST%\full\%BASE%-full.mp4"
) else (
    echo   Full exists, skip
)

REM ── Preview (first 6s, CRF 20, no audio) ──────────────────
if not exist "%DST%\previews\%BASE%-preview.mp4" (
    echo   Preview 6s CRF20...
    ffmpeg -hide_banner -loglevel warning -i "%SRCFILE%" -t 6 -an -c:v libx264 -crf 20 -preset slow -tune film -movflags +faststart -y "%DST%\previews\%BASE%-preview.mp4"
) else (
    echo   Preview exists, skip
)

REM ── Poster (frame at 1s, JPEG q2) ─────────────────────────
if not exist "%DST%\posters\%BASE%.jpg" (
    echo   Poster JPEG q2...
    ffmpeg -hide_banner -loglevel warning -i "%SRCFILE%" -ss 1 -frames:v 1 -q:v 2 -y "%DST%\posters\%BASE%.jpg"
) else (
    echo   Poster exists, skip
)

goto :eof
