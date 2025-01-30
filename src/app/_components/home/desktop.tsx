import { VxCtx } from "@/app/ctx/convex/vx";
import { CursorCtx } from "@/app/ctx/cursor";
import { cn } from "@/lib/utils";
import HyperSpace from "@/ui/cursor";
import { HyperList } from "@/ui/list";
import { use } from "react";
import { EventCard } from "./components/event-card";
import { HeroSection } from "./components/hero";
import { Sidebar } from "./components/sidebar";

export const DesktopView = () => {
  const { isInputHovered } = use(CursorCtx)!;
  return (
    <div
      className={cn(
        "flex h-full w-screen overflow-hidden transition-all duration-300",
      )}
    >
      <Sidebar />
      <MainContent />
      <HyperSpace isInputHovered={isInputHovered} />
    </div>
  );
};

const MainContent = () => {
  const { vxEvents } = use(VxCtx)!;

  return (
    <main className="w-full bg-coal">
      <div className="z-1 relative">
        <section id="photos" className="overflow-scroll md:h-[calc(100vh)]">
          <HyperList
            keyId="event_id"
            data={vxEvents}
            component={EventCard}
            container="columns-3 gap-4 sm:columns-3 px-4"
          >
            <div
              key={"hero"}
              className="flex h-96 w-full items-center justify-center"
            >
              <HeroSection />
            </div>
          </HyperList>

          {/* <Partners /> */}
        </section>
      </div>
    </main>
  );
};

// interface ImageItem {
//   id: number;
//   src: string;
// }
// const ListItem = (img: ImageItem) => (
//   <Image
//     className="mb-4 size-full rounded-lg object-contain"
//     src={img.src}
//     alt={`Random stock image ${img.id + 1}`}
//   />
// );

// const images: ImageItem[] = useMemo(
//   () =>
//     Array.from({ length: 9 }, (_, i) => {
//       const isLandscape = i % 4 === 0;
//       const width = isLandscape ? 800 : 600;
//       const height = isLandscape ? 600 : 800;
//       return {
//         id: i,
//         src: `https://picsum.photos/seed/${i + 1}/${width}/${height}`,
//       };
//     }),
//   [],
// );
