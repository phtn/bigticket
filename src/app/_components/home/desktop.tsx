import { Button, Image } from "@nextui-org/react";
import { Sidebar } from "./components/sidebar";
import { BlurFade } from "@/ui/blur/fade";
import { HyperList } from "@/ui/list";
import { useCallback, useMemo } from "react";
import { Icon } from "@/icons";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/utils";
import { opts } from "@/utils/helpers";

export const DesktopView = () => {
  const { open, toggle } = useToggle();

  const SidebarViewOptions = useCallback(() => {
    const options = opts(<Sidebar toggleFn={toggle} />, null);
    return <>{options.get(open)}</>;
  }, [open, toggle]);

  return (
    <div
      className={cn(
        "flex h-screen w-screen overflow-hidden transition-all duration-300",
      )}
    >
      <SidebarViewOptions />
      <MainContent toggleFn={toggle} open={open} />
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
    <main className="w-full bg-white">
      <div className="z-1 relative">
        <Button
          size="sm"
          isIconOnly
          onPress={toggleFn}
          className={cn(
            "absolute top-[1px] z-50 -translate-x-1 rounded-s-none bg-primary/50 shadow-sm backdrop-blur-lg",
            "transition-transform duration-300 hover:translate-x-0 data-[hover=true]:bg-primary/80 data-[hover=true]:opacity-100",
            { hidden: open },
          )}
        >
          <Icon
            name="RightChev"
            className="size-4 stroke-transparent text-macl-mint"
          />
        </Button>
        <section
          id="photos"
          className="overflow-scroll p-4 md:h-[calc(100vh-72px)]"
        >
          <HyperList
            data={images}
            component={ListItem}
            container="columns-2 gap-4 sm:columns-3"
          />
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
  <BlurFade key={img.src} inView>
    <Image
      className="mb-4 size-full rounded-lg object-contain"
      src={img.src}
      alt={`Random stock image ${img.id + 1}`}
    />
  </BlurFade>
);
