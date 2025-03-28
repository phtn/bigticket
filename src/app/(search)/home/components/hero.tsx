import { Iconx } from "@/icons";
import { cn } from "@/lib/utils";
import { WarpDrive } from "@/ui/loader/warp";
import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

interface HeroSectionProps extends HTMLAttributes<HTMLDivElement> {
  badge?: string;
  headline?: {
    regular?: string;
    gradient?: string;
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

const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      badge = "The best are already here.",
      headline = {
        regular: "Excitement ",
        gradient: "guaranteed.",
      },
      description = "",
      ctaText = "Browse all events",
      ctaHref = "#",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn("relative h-64 w-full md:h-full", className)}
        ref={ref}
        {...props}
      >
        <div className="absolute top-0 z-[0] h-full w-screen bg-void/10" />
        <WarpDrive
          gridColor="#132123aa"
          className="absolute -top-4 z-10 flex h-full w-full items-center justify-center bg-coal p-0 shadow-none"
        >
          <div />
        </WarpDrive>
        <section className="z-1 relative mx-auto max-w-full">
          <div className="relative z-10 mx-auto max-w-screen-xl gap-12 px-4 py-14 md:px-8 md:py-28">
            <div className="leading-0 mx-auto max-w-3xl space-y-6 text-center md:space-y-5 lg:leading-5">
              <Badge badge={badge} />
              <h1 className="font-geist mx-auto whitespace-nowrap bg-chalk bg-clip-text text-3xl tracking-tighter text-transparent dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] md:text-6xl">
                {headline.regular}
                <span className="bg-gradient-to-r from-teal-300 to-orange-200 bg-clip-text pl-2 text-transparent">
                  {headline.gradient}
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
                {description}
              </p>
              <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
                <span className="inline-block_ relative hidden overflow-hidden rounded-full p-[1.5px]">
                  <span className="absolute inset-[-1000%] animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white text-xs font-medium backdrop-blur-3xl dark:bg-gray-950">
                    <a
                      href={ctaHref}
                      className="group inline-flex w-full items-center justify-center rounded-full border-[1px] border-input bg-gradient-to-tr from-zinc-300/20 via-purple-400/30 to-transparent px-10 py-4 text-center text-gray-900 transition-all hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-purple-400/40 hover:to-transparent dark:from-zinc-300/5 dark:via-purple-400/20 dark:text-white dark:hover:from-zinc-300/10 dark:hover:via-purple-400/30 sm:w-auto"
                    >
                      {ctaText}
                    </a>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  },
);
HeroSection.displayName = "HeroSection";

const Badge = ({ badge }: { badge: string }) => (
  <h2 className="font-geist group mx-auto flex w-fit items-center gap-2 rounded-3xl border border-vanilla/15 bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent px-5 py-2 text-sm text-chalk/80 dark:from-zinc-300/5 dark:via-gray-400/5">
    <Iconx
      name="sparkle"
      className="inline size-4 duration-300 group-hover:scale-[1.15]"
    />
    <span>{badge}</span>
  </h2>
);

interface HeroProps {
  children?: ReactNode;
  headline?: {
    regular?: string;
    gradient?: string;
  };
}
const Hero = ({ children, headline }: HeroProps) => {
  return (
    <div className="relative w-full">
      <div className="absolute bottom-8 left-0 z-50 flex w-screen items-center justify-center text-white md:bottom-14">
        {children}
      </div>
      <HeroSection headline={headline} />
    </div>
  );
};

export { Hero };
