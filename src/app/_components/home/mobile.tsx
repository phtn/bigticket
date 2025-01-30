import { HyperList } from "@/ui/list";
import { EventCard } from "./components/event-card";
import { HeroSection } from "./components/hero";
import { use } from "react";
import { VxCtx } from "@/app/ctx/convex/vx";
import { Proxima } from "../proxima";
import { Sidebar } from "./components/sidebar";

export const MobileView = () => {
  const { vxEvents } = use(VxCtx)!;
  return (
    <div className="min-h-screen bg-coal text-white">
      <Sidebar />
      <HyperList
        keyId="event_id"
        data={vxEvents}
        component={EventCard}
        container="space-y-4"
        itemStyle="px-4"
      >
        <div
          key={"hero"}
          className="flex h-80 w-full items-center justify-center"
        >
          <HeroSection />
        </div>
      </HyperList>
      <Proxima />
    </div>
  );
};
