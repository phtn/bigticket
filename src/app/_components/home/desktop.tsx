import { CursorCtx } from "@/app/ctx/cursor";
import { cn } from "@/lib/utils";
import { HyperSpace } from "@/ui/cursor";
import { HyperList } from "@/ui/list";
import { use, useCallback, useState } from "react";
import { EventCard } from "./components/event-card";
import { Hero } from "./components/hero";
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
  const [selected, setSelected] = useState<string>("all");

  const handleSelectCategory = useCallback(
    (id: string) => () => {
      console.log(id);
      setSelected(id);
    },
    [setSelected],
  );
  const CategoryItem = useCallback(
    (category: Category) => (
      <h2
        onClick={handleSelectCategory(category.id)}
        className={cn(
          "group mx-auto flex w-fit items-center px-3.5 py-1.5",
          "rounded-full border border-chalk/20 font-inter text-xs",
          "bg-gradient-to-tr from-zinc-400/20 via-gray-500/20 to-slate-500/20",
          "cursor-pointer tracking-tight backdrop-blur-md",
          {
            "border-coal/80 bg-chalk/80 text-coal": selected === category.id,
          },
          "hover:bg-",
        )}
      >
        <span
          className={cn({
            "rounded-full opacity-80": selected !== category.id,
          })}
        >
          {category.value}
        </span>
      </h2>
    ),
    [handleSelectCategory, selected],
  );

  return (
    <div className="w-full bg-coal">
      <main>
        <section id="photos" className="">
          <HyperList
            keyId="event_id"
            data={prefetch?.events}
            component={EventCard}
            container="overflow-scroll md:h-[calc(100vh)] columns-3 gap-4 sm:columns-3 px-4"
            delay={0.1}
          >
            <div
              key={"hero"}
              className="flex h-96 w-full items-center justify-center"
            >
              <Hero>
                <HyperList
                  container="flex w-fit gap-4"
                  data={categories}
                  component={CategoryItem}
                  direction="up"
                  delay={1}
                />
              </Hero>
            </div>
          </HyperList>
        </section>
      </main>
    </div>
  );
};

interface Category {
  id: string;
  value: string;
}

const categories: Category[] = [
  {
    id: "all",
    value: "all",
  },
  {
    id: "upcoming",
    value: "upcoming",
  },
  {
    id: "events",
    value: "events",
  },
  {
    id: "online",
    value: "online",
  },
  {
    id: "training",
    value: "training",
  },
];
