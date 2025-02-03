import { HyperList } from "@/ui/list";
import { EventCard } from "./components/event-card";
import { Hero } from "./components/hero";
import { use } from "react";
import { Proxima } from "../proxima";
import { Collections } from "../sidebar";
import { PreloadedEventsCtx } from "@/app/ctx/event/preload";

export const MobileView = () => {
  const { signedEvents } = use(PreloadedEventsCtx)!;
  return (
    <div className="bg-coal">
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
