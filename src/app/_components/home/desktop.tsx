import { Button, Image } from "@nextui-org/react";
import { Sidebar } from "./components/sidebar";
import { HyperList } from "@/ui/list";
import { use, useMemo } from "react";
import { Icon } from "@/icons";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/utils";
import { Partners } from "./components";
import HyperSpace from "@/ui/cursor";
import { CursorCtx } from "@/app/ctx/cursor";
import { Hero } from "./components/hero";

export const DesktopView = () => {
  const { open, toggle } = useToggle();
  const { isInputHovered } = use(CursorCtx)!;

  return (
    <div
      className={cn(
        "flex h-full w-screen overflow-hidden transition-all duration-300",
      )}
    >
      <Sidebar toggleFn={toggle} open={open} />
      <MainContent toggleFn={toggle} open={open} />
      <HyperSpace isInputHovered={isInputHovered} />
    </div>
  );
};

interface MainContentProps {
  toggleFn: VoidFunction;
  open: boolean;
}
const MainContent = ({ toggleFn, open }: MainContentProps) => {
  const images: ImageItem[] = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const isLandscape = i % 4 === 0;
        const width = isLandscape ? 800 : 600;
        const height = isLandscape ? 600 : 800;
        return {
          id: i,
          src: `https://picsum.photos/seed/${i + 1}/${width}/${height}`,
        };
      }),
    [],
  );
  return (
    <main className="w-full bg-coal">
      <div className="z-1 relative">
        <Button
          size="sm"
          isIconOnly
          onPress={toggleFn}
          className={cn(
            "absolute top-4 z-50 -translate-x-1 rounded-s-none bg-macl-mint backdrop-blur-lg",
            "-translate-x-5 transition-transform duration-300 hover:translate-x-0 data-[hover=true]:opacity-100",
            { "-translate-x-8": open },
          )}
        >
          <Icon
            name="RightChev"
            className="size-4 stroke-transparent text-white"
          />
        </Button>

        <section id="photos" className="overflow-scroll md:h-[calc(100vh)]">
          <HyperList
            keyId="src"
            data={images}
            component={ListItem}
            container="columns-3 gap-4 sm:columns-3 px-4"
          >
            <div className="flex h-96 w-full items-center justify-center bg-coal">
              <Hero
                headline="Get tickets to"
                keywords={[
                  "events",
                  "concerts",
                  "parties",
                  "flights",
                  "hotels",
                  "shops",
                ]}
              />
            </div>
          </HyperList>

          <Partners />
        </section>
      </div>
    </main>
  );
};

interface ImageItem {
  id: number;
  src: string;
}
const ListItem = (img: ImageItem) => (
  <Image
    className="mb-4 size-full rounded-lg object-contain"
    src={img.src}
    alt={`Random stock image ${img.id + 1}`}
  />
);
