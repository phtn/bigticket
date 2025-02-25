import { useDime } from "@/hooks/useDime";
import { cn } from "@/lib/utils";
import { ChineBorder } from "@/ui/card/border";
import { useCarousel } from "@/ui/carousel";
import { Bouncy } from "@/ui/loader/bouncy";
import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import YouTube from "react-youtube";
import { Brand, BrandName, Tickets, Title } from "../navbar/brand";

interface YProps {
  src: string;
  ref: RefObject<HTMLDivElement | null>;
  idx: number;
}
export const Y = ({ src, ref, idx }: YProps) => {
  const { dimensions } = useDime(ref);
  const { currentIndex } = useCarousel();
  const [autoplay, setAutoplay] = useState(0);
  const getState = useCallback(() => {
    setAutoplay(idx === currentIndex ? 1 : 0);
  }, [idx, currentIndex]);
  useEffect(() => {
    getState();
  }, [getState]);

  const opts = useMemo(
    () => ({
      height: dimensions?.height + 20,
      width: "100%",
      playerVars: {
        autoplay,
        start: 5,
      },
      controls: 0,
    }),
    [dimensions, autoplay],
  );

  const Player = useCallback(
    () => dimensions && autoplay && <YouTube videoId={src} opts={opts} />,
    [dimensions, autoplay, src, opts],
  );

  return (
    <div className={cn("relative -top-4 size-full bg-black")}>
      <Player />
      <div
        className={cn(
          "absolute top-0 z-50 flex size-full items-center justify-center bg-black opacity-100 transition-all delay-[5s] duration-1000",
          {
            "opacity-0": autoplay === 1,
          },
        )}
      >
        <ChineBorder
          color={["#FFBE7B", "#02C7BE"]}
          borderRadius={32}
          borderWidth={6}
          duration={6}
          className="h-fit w-fit bg-gradient-to-br from-white via-vanilla to-cake p-4 shadow-lg shadow-shade/60"
        >
          <div className="flex w-[200px] items-center justify-between gap-6 whitespace-nowrap">
            <Brand>
              <BrandName>
                <Tickets />
                <Title />
              </BrandName>
            </Brand>

            <Bouncy />
          </div>
        </ChineBorder>
      </div>
    </div>
  );
};
