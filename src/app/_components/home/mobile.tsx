import { HyperList } from "@/ui/list";
import { EventCard } from "./components/event-card";
import { Hero } from "./components/hero";
import { use } from "react";
import { VxCtx } from "@/app/ctx/convex/vx";
import { Proxima } from "../proxima";
import { Collections } from "../sidebar";

export const MobileView = () => {
  const { vxEvents } = use(VxCtx)!;
  return (
    <div className="bg-coal">
      <Collections />
      <HyperList
        keyId="event_id"
        data={vxEvents}
        component={EventCard}
        container="space-y-4 h-[calc(80vh)] overflow-y-scroll"
        itemStyle=""
      >
        <div
          key={"hero"}
          className="flex h-80 w-full items-center justify-center"
        >
          <Hero>
            <div />
          </Hero>
        </div>
      </HyperList>
      <Proxima />
    </div>
  );
};
