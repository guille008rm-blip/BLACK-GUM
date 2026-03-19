import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";

/* ─── Props ─────────────────────────────────────────────────── */
interface DiaryLoaderProps {
  logoSrc?: string;
}

/* ─── Colores de marca ──────────────────────────────────────── */
const BG = "#0b0b0b";
const EMBER = "#f1a93a";
const EMBER_GLOW = "rgba(241, 169, 58, 0.55)";

/**
 * DiaryLoader – Animación de carga con el logo de Black Gum.
 *
 * Timeline (a 30 fps, 150 frames = 5 s):
 *   0-20   → Logo fade-in + scale desde 0.6
 *  20-120  → Anillo gira + logo pulsa suavemente (loop)
 * 120-150  → Todo hace fade-out
 */
export const DiaryLoader: React.FC<DiaryLoaderProps> = ({
  logoSrc = "/public/logo-white.png",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ─── Fase 1: Entrada (0-20 frames) ────────────────────────── */
  const enterScale = spring({ frame, fps, from: 0.6, to: 1, durationInFrames: 22 });
  const enterOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateRight: "clamp",
  });

  /* ─── Fase 2: Pulso del logo (loop suave, 20-120) ─────────── */
  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 2 * 0.7),
    [-1, 1],
    [0.95, 1.07]
  );

  /* ─── Fase 3: Salida (120-150 frames) ────────────────────── */
  const exitOpacity = interpolate(frame, [120, 146], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const combinedOpacity = enterOpacity * exitOpacity;
  const combinedScale = enterScale * pulse;

  /* ─── Anillo giratorio ────────────────────────────────────── */
  const ringRotation = interpolate(frame, [0, 150], [0, 1200]);
  const ringOpacity = interpolate(frame, [4, 18, 120, 146], [0, 0.9, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ─── Glow pulsante ──────────────────────────────────────── */
  const glowSpread = interpolate(
    Math.sin((frame / fps) * Math.PI * 2 * 0.7),
    [-1, 1],
    [12, 30]
  );
  const glowOpacity = interpolate(
    Math.sin((frame / fps) * Math.PI * 2 * 0.7),
    [-1, 1],
    [0.3, 0.75]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: combinedOpacity,
      }}
    >
      {/* ─── Anillo ───────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          border: `3px solid transparent`,
          borderTopColor: EMBER,
          borderRightColor: `rgba(241, 169, 58, 0.3)`,
          transform: `rotate(${ringRotation}deg)`,
          opacity: ringOpacity,
        }}
      />

      {/* ─── Glow detrás del logo ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${EMBER_GLOW} 0%, transparent 70%)`,
          filter: `blur(${glowSpread}px)`,
          opacity: glowOpacity * combinedOpacity,
        }}
      />

      {/* ─── Logo ─────────────────────────────────────────── */}
      <Img
        src={staticFile("logo-white.png")}
        style={{
          width: 120,
          height: 120,
          objectFit: "contain",
          transform: `scale(${combinedScale})`,
          filter: `drop-shadow(0 0 ${glowSpread}px ${EMBER_GLOW})`,
        }}
      />
    </AbsoluteFill>
  );
};
