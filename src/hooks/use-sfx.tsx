import { useSound } from "use-sound";

export const useSoundFX = () => {
  const defaultOptions = {
    volume: 0.8,
    interrupt: true,
  };
  const [accessGrantedSFX] = useSound(
    "/sfx/access-granted.mp3",
    defaultOptions,
  );
  const [accessDeniedSFX] = useSound("/sfx/access-denied.mp3", defaultOptions);
  const [warningSFX] = useSound("/sfx/warning.mp3", defaultOptions);
  const [dangerSFX] = useSound("/sfx/danger.wav", defaultOptions);
  const [errorSFX] = useSound("/sfx/error.wav", defaultOptions);
  const [startSFX] = useSound("/sfx/scanner-start.wav", defaultOptions);
  const [stopSFX] = useSound("/sfx/stop.mp3", defaultOptions);

  return {
    accessGrantedSFX,
    accessDeniedSFX,
    warningSFX,
    dangerSFX,
    errorSFX,
    startSFX,
    stopSFX,
  };
};
