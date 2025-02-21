import { CursorCtx } from "@/app/ctx/cursor";
import { cn } from "@/lib/utils";
import { HyperSpace } from "@/ui/cursor";
import { HyperList } from "@/ui/list";
import { use, useCallback, useState } from "react";
import { EventCard } from "../../(search)/event-card";
import { Hero } from "./components/hero";
import { Collections } from "../sidebar";
import { PreloadedEventsCtx } from "@/app/ctx/event/all";
import { categories, type Category } from "./components/category";
import { Proxima } from "../proxima";

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
  const { signedEvents } = use(PreloadedEventsCtx)!;
  const [selected, setSelected] = useState<string>("all");

  const handleSelectCategory = useCallback(
    (id: string) => () => {
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
            data={signedEvents}
            component={EventCard}
            container="overflow-scroll md:h-fit grid grid-cols-1 gap-4 sm:grid-cols-3 px-4"
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

      <Proxima />
    </div>
  );
};
