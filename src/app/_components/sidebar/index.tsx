import { SidebarCtx } from "@/app/ctx/sidebar";
import { cn } from "@/lib/utils";
import { use } from "react";
import { HideButton, ListTitle } from "./components";
import type { SidebarProps } from "./types";
import { EventsList, GetAwaysList } from "./lists";

export const Sidebar = ({ children, className }: SidebarProps) => {
  const { toggle, open } = use(SidebarCtx)!;
  return (
    <aside className={cn("absolute z-[200] w-full")}>
      <div
        className={cn(
          "fixed flex w-[360px] -translate-x-[360px] items-start p-4 transition-transform duration-300 portrait:px-4",
          { "translate-x-0": open },
          className,
        )}
      >
        <HideButton fn={toggle} />
        {children}
      </div>
    </aside>
  );
};

export const Collections = () => {
  return (
    <Sidebar>
      <section className="relative w-full space-y-6 rounded-xl border-[0.33px] border-primary-100 bg-chalk/80 p-2 shadow-lg backdrop-blur-2xl md:h-[calc(60vh)]">
        <EventsList />
        <GetAwaysList />
        <ListTitle title="big tickets" />
      </section>
    </Sidebar>
  );
};
