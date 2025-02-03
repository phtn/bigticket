import { CursorCtx } from "@/app/ctx/cursor";
import { cn } from "@/lib/utils";
import { HyperSpace } from "@/ui/cursor";
import { HyperList } from "@/ui/list";
import { use } from "react";
import { EventCard } from "./components/event-card";
import { HeroSection } from "./components/hero";
import { Collections } from "../sidebar";
import { PreloadedEventCtx } from "@/app/content";

export const DesktopView = () => {
  const { isInputHovered } = use(CursorCtx)!;
  return (
    <div
      className={cn(
        "flex h-full w-screen overflow-hidden transition-all duration-300",
      )}
    >
      <Collections />
      <MainContent />
      <HyperSpace isInputHovered={isInputHovered} />
    </div>
  );
};

const MainContent = () => {
  const prefetch = use(PreloadedEventCtx);

  return (
    <main className="w-full bg-coal">
      <section id="photos" className="">
        <HyperList
          keyId="event_id"
          data={prefetch?.events}
          component={EventCard}
          container="overflow-scroll md:h-[calc(100vh)] columns-3 gap-4 sm:columns-3 px-4"
        >
          <div
            key={"hero"}
            className="flex h-96 w-full items-center justify-center"
          >
            <HeroSection />
          </div>
        </HyperList>
      </section>
    </main>
  );
};
