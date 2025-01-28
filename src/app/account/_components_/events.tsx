import type { SelectEvent } from "convex/events/d";
import { HyperList } from "@/ui/list";
import { Spinner } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { use } from "react";
import { VxCtx } from "@/app/ctx/convex/vx";

export const EventsContent = () => {
  const { vxEvents, pending } = use(VxCtx)!;

  return (
    <div className="size-full min-h-[420px] border-b border-secondary px-6">
      <section className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tighter">My Events</h1>
        <Spinner className={cn({ hidden: !pending })} size="sm" />
      </section>
      <div>
        <HyperList data={vxEvents} component={EventItem} keyId="event_id" />
      </div>
    </div>
  );
};

const EventItem = (event: SelectEvent) => (
  <div className="flex h-12 gap-4 border-b">
    <div>{event.event_id}</div>
    <div>{event.event_name}</div>
  </div>
);
