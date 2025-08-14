import { useCallback, useRef, useEffect } from "react";

/**
 * useSleep - A custom hook for delaying execution with optional cancellation
 *
 */

export const useSleep = (
  defaultDelay = 1000,
): { sleep: (delay?: number) => Promise<void>; cancel: VoidFunction } => {
  // Use ReturnType<typeof setTimeout> for a more robust type for timer handles across environments (browser/Node.js).
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Type rejectRef to correctly hold a Promise reject function or null.
  const rejectRef = useRef<((reason?: Error) => void) | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;

      if (rejectRef.current) {
        // rejectRef.current is now correctly typed as a callable function.
        rejectRef.current(new Error("Sleep cancelled"));
        rejectRef.current = null;
      }
    }
  }, []);

  const sleep = useCallback(
    (delay = defaultDelay) => {
      cancel(); // cancel any existing timeout before starting a new one

      // Explicitly define Promise<void> as the return type, aligning with `resolve()` being called without arguments.
      return new Promise<void>((resolve, reject) => {
        // rejectRef.current can now correctly be assigned the reject function.
        rejectRef.current = reject;

        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          rejectRef.current = null;
          // resolve() is now valid for a Promise<void>.
          resolve();
        }, delay);
      });
    },
    [defaultDelay, cancel],
  );

  return { sleep, cancel };
};
