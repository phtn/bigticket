"use client";

import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const useDime = <T extends Element>(r: RefObject<T | null>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [screen, setScreen] = useState({ width: 0, height: 0 });
  const [centerpoint, setCenterpoint] = useState({ x: 0, y: 0 });

  const getScreenSize = useCallback(() => {
    if (typeof window !== "undefined") {
      setScreen({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  useEffect(() => {
    getScreenSize();
  }, [getScreenSize]);

  useEffect(() => {
    const updateDimensions = () => {
      if (r.current) {
        const { width, height } = r.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [r]);

  const x = useMemo(() => {
    if (screen.width && dimensions.width) {
      return screen.width / 2 - dimensions.width * 0.725;
    }
  }, [screen, dimensions]);
  const y = useMemo(() => {
    if (screen.height && dimensions.height) {
      return screen.height / 2 - dimensions.height * 0.725;
    }
  }, [screen, dimensions]);

  const getCenterpoint = useCallback(() => {
    if (x && y) {
      setCenterpoint({ x, y });
    }
  }, [x, y]);

  useEffect(() => {
    getCenterpoint();
  }, [getCenterpoint]);

  return { dimensions, screen, centerpoint };
};
