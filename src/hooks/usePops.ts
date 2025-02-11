"use client";

import { useEffect } from "react";

export function usePops(open: boolean, toggle: VoidFunction) {
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      window.addEventListener("popstate", handlePopState);
      if (open) {
        window.history.pushState(null, "", window.location.href);
        toggle();
      }
    };

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [open, toggle]);
}
