import { HyperList } from "@/ui/list";
import { EventCard } from "./components/event-card";
import { Hero } from "./components/hero";
import { use, useCallback, useState } from "react";
import { Proxima } from "../proxima";
import { Collections } from "../sidebar";
import { PreloadedEventsCtx } from "@/app/ctx/event/preload";
import { categories, type Category } from "./components/category";
import { cn } from "@/lib/utils";

export const MobileView = () => {
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
    <div className="relative bg-coal">
      <Collections />
      <HyperList
        keyId="event_id"
        data={signedEvents}
        component={EventCard}
        container="space-y-4 h-[calc(80vh)] overflow-y-scroll"
        itemStyle=""
      >
        <div
          key={"hero"}
          className="flex h-1/3 w-full items-center justify-center"
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

      <Proxima />
    </div>
  );
};
