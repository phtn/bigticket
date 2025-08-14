import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Compute initial value synchronously (only if `window` exists)
  const getIsMobile = () =>
    typeof window !== "undefined"
      ? window.innerWidth < MOBILE_BREAKPOINT
      : undefined;

  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    getIsMobile,
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mql.addEventListener("change", onChange);
    // Ensure state is in sync
    setIsMobile(mql.matches);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return { isMobile };
}
