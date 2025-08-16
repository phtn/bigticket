"use client";

import type { ClassName } from "@/app/types";
import { useDime } from "@/hooks/useDime";
import { cn } from "@nextui-org/react";
import { useEffect, useRef } from "react";
import anime from "animejs";
import { Log } from "@/utils/logger";

interface TextLoaderProps {
  size?: number;
  container?: ClassName;
  color?: ClassName;
}

export const TextLoader = ({
  size = 16,
  container,
  color,
}: TextLoaderProps) => {
  const containerRef = useRef(null);
  const { width } = useDime(containerRef).dimensions;

  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const dotCount = dotsRef.current.length;

    const computeDelay = (i: number) =>
      Math.sin((i / dotCount) * Math.PI) * 300;
    // - size *-3 4 = 5 - (2 * 4) ==-3
    // - size *-1 3 = 5 - (2 * 3) ==-1
    // + size * 1 2 = 5 - (2 * 2) == 1
    // + size * 3 1 = 5 - (2 * 1) == 3
    // + size * 5 0 = 5 - (2 * 0) == 5
    const computeDist = (i: number) => width - (size * (2.65 * i)) / 2;

    const t = anime.timeline({
      targets: dotsRef.current,
      easing: "easeInOutExpo",
      direction: "alternate",
      duration: 1750,
      loop: true,
    });

    t.add({
      translateX: (_: undefined, i: number) => computeDist(i / 4),
      delay: (_, i) => computeDelay(i),
      scale: 0,
    })
      .add({
        translateX: width * 0.2,
        delay: (_, i) => computeDelay(i / 2),
        scale: 0.66,
      })
      .add({
        translateX: -width / 4,
        delay: (_, i) => computeDelay(i / 2),
        scale: 0,
      });
  }, [width, size]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-4 min-w-[112px] justify-center overflow-hidden",
        container,
      )}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          onClick={() => {
            const target = dotsRef.current[i];
            Log("ref", target?.getBoundingClientRect().left);
          }}
          key={i}
          ref={(ref) => {
            dotsRef.current[i] = ref;
          }}
          className={cn("drop-shadow-xs leading-none text-zinc-400", color)}
          style={{
            position: "absolute",
            transform: "translateY(-50%)",
            top: "50%",
            left: i * size,
            height: size,
            width: size,
          }}
        >
          ●
        </div>
      ))}
    </div>
  );
};
