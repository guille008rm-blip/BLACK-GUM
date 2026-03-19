import { Composition } from "remotion";
import { DiaryLoader } from "./compositions/DiaryLoader";

/**
 * Root – registra todas las composiciones (vídeos) del proyecto.
 * Cada <Composition> aparece como una opción en Remotion Studio.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ─── Diary Loader ──────────────────────────────────── */}
      <Composition
        id="DiaryLoader"
        component={DiaryLoader}
        durationInFrames={150}      /* 5 s @ 30 fps */
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          logoSrc: "/public/logo-white.png",
        }}
      />

      {/*
        Añade más composiciones aquí:

        <Composition
          id="IntroBlackGum"
          component={IntroBlackGum}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
      */}
    </>
  );
};
