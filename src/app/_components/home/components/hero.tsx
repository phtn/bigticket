import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { type HTMLAttributes, type CSSProperties, forwardRef } from "react";

export interface HeroProps {
  headline: string;
  keywords: string[];
}

interface HeroSectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: {
    regular: string;
    gradient: string;
  };
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  bottomImage?: {
    light: string;
    dark: string;
  };
  gridOptions?: {
    angle?: number;
    cellSize?: number;
    opacity?: number;
    lightLineColor?: string;
    darkLineColor?: string;
  };
}

const RetroGrid = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.3,
  lightLineColor = "gray",
  darkLineColor = "gray",
}) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        `opacity-[var(--opacity)]`,
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-grid [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:300vh] [inset:0%_0px] [margin-left:-200%] [transform-origin:100%_0_0] [width:600vw] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-void" />
    </div>
  );
};

const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title = "The best are already here.",
      subtitle = {
        regular: "Excitement ",
        gradient: "guaranteed.",
      },
      description = "",
      ctaText = "Browse all events",
      ctaHref = "#",
      // bottomImage = {
      //   light: "https://farmui.vercel.app/dashboard-light.png",
      //   dark: "https://farmui.vercel.app/dashboard.png",
      // },
      gridOptions,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn("relative h-full w-full", className)}
        ref={ref}
        {...props}
      >
        <div className="absolute top-0 z-[0] h-screen w-screen bg-orange-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(94,234,212,0.15),rgba(255,255,255,0))] dark:bg-orange-950/10 dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(94,234,212,0.2),rgba(255,255,255,0))]" />
        <section className="z-1 relative mx-auto max-w-full">
          <RetroGrid {...gridOptions} />
          <div className="z-10 mx-auto max-w-screen-xl gap-12 px-4 py-28 md:px-8">
            <div className="leading-0 mx-auto max-w-3xl space-y-5 text-center lg:leading-5">
              <h1 className="font-geist group mx-auto flex w-fit items-center gap-2 rounded-3xl border-[2px] border-black/5 bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent px-5 py-2 text-sm text-gray-600 dark:border-white/5 dark:from-zinc-300/5 dark:via-gray-400/5 dark:text-gray-400">
                <Icon
                  name="Sparkles2"
                  className="inline size-4 stroke-0 duration-300 group-hover:scale-[1.15]"
                />
                <span>{title}</span>
              </h1>
              <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] bg-clip-text text-4xl tracking-tighter text-transparent md:text-6xl dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
                {subtitle.regular}
                <span className="bg-gradient-to-r from-teal-600 to-pink-500 bg-clip-text text-transparent dark:from-teal-300 dark:to-orange-200">
                  {subtitle.gradient}
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
                {description}
              </p>
              <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
                <span className="inline-block_ relative hidden overflow-hidden rounded-full p-[1.5px]">
                  <span className="absolute inset-[-1000%] animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white text-xs font-medium backdrop-blur-3xl dark:bg-gray-950">
                    <a
                      href={ctaHref}
                      className="border-input group inline-flex w-full items-center justify-center rounded-full border-[1px] bg-gradient-to-tr from-zinc-300/20 via-purple-400/30 to-transparent px-10 py-4 text-center text-gray-900 transition-all hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-purple-400/40 hover:to-transparent sm:w-auto dark:from-zinc-300/5 dark:via-purple-400/20 dark:text-white dark:hover:from-zinc-300/10 dark:hover:via-purple-400/30"
                    >
                      {ctaText}
                    </a>
                  </div>
                </span>
              </div>
            </div>
            {/* {bottomImage && (
              <div className="relative z-10 mx-10 mt-32 hidden">
                <img
                  src={bottomImage.light}
                  className="w-full rounded-lg border border-gray-200 shadow-lg dark:hidden"
                  alt="Dashboard preview"
                />
                <img
                  src={bottomImage.dark}
                  className="hidden w-full rounded-lg border border-gray-800 shadow-lg dark:block"
                  alt="Dashboard preview"
                />
              </div>
            )} */}
          </div>
        </section>
      </div>
    );
  },
);
HeroSection.displayName = "HeroSection";

export { HeroSection };
