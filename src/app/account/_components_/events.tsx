import type { SelectEvent } from "convex/events/d";
import { HyperList } from "@/ui/list";
import { Spinner } from "@nextui-org/react";
import { use, useCallback } from "react";
import { VxCtx } from "@/app/ctx/convex/vx";
import Link from "next/link";
import { Icon } from "@/icons";
import { opts } from "@/utils/helpers";

export const EventsContent = () => {
  const { vxEvents, pending } = use(VxCtx)!;

  const Counter = useCallback(() => {
    const options = opts(
      <Spinner size="sm" />,
      <Count count={vxEvents?.length} />,
    );
    return <>{options.get(pending)}</>;
  }, [pending, vxEvents?.length]);

  return (
    <div className="size-full min-h-[420px] space-y-4 border-b border-secondary px-6">
      <section className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tighter">My Events</h1>
        <Counter />
      </section>
      <div className="overflow-hidden rounded-lg border border-primary/60 bg-white">
        <HyperList
          data={vxEvents}
          component={EventItem}
          keyId="event_id"
          itemStyle="border-t border-primary/60  "
        >
          <EventTableHeader />
        </HyperList>
      </div>
    </div>
  );
};

const Count = (props: { count: number | undefined }) => (
  <div className="relative flex size-8 items-center justify-center">
    <Icon name="Squircle" className="absolute z-0 size-8 text-slate-300" />
    <p className="z-1 relative font-semibold">{props.count}</p>
  </div>
);

const EventItem = (event: SelectEvent) => (
  <div className="flex h-14 items-center font-inter">
    <div className="flex w-20 justify-center font-mono text-xs">
      <Link href={`/e/${event.event_id}`}>
        {event.event_id.substring(0, 6)}
      </Link>
    </div>
    <div className="w-64 ps-2 font-semibold tracking-tighter">
      {event.event_name}
    </div>
    <div className="flex w-24 justify-center text-sm">
      {event.status ? "inactive" : "active"}
    </div>
    <div className="flex w-32 justify-center text-sm">{event.event_date}</div>
    <div className="flex w-32 justify-center text-sm">{event.event_time}</div>
    <div className="flex w-24 justify-center text-sm">{event.event_type}</div>
    <div className="flex w-56 justify-center text-sm">
      {event.event_type === "onsite" ? event.event_geo : event.event_url}
    </div>
    <div className="flex w-28 justify-end pe-2 text-sm">
      {event.ticket_count}
    </div>
    <div className="flex w-28 justify-end pe-2 text-sm">
      {event.ticket_value ?? "not set"}
    </div>
    <div className="flex flex-1 justify-end space-x-6 px-4 text-sm font-semibold capitalize">
      <Link
        href={`e/${event.event_id}`}
        className="group/link relative flex size-9 items-center justify-center transition-all duration-300 hover:text-gray-200"
      >
        <Icon
          name="Squircle"
          className="absolute z-0 size-9 scale-0 text-gray-900 transition-all duration-300 group-hover/link:scale-100"
        />
        <Icon name="Settings" className="z-1 relative size-5 stroke-0" />
      </Link>
      <Link
        href={`e/${event.event_id}`}
        className="group/link relative flex size-9 items-center justify-center transition-all duration-300 hover:text-white"
      >
        <Icon
          name="Squircle"
          className="absolute z-0 size-9 scale-0 text-gray-900 transition-all duration-300 group-hover/link:scale-100"
        />
        <Icon name="ArrowRightUp" className="z-1 relative size-5 stroke-0" />
      </Link>
    </div>
  </div>
);

const EventTableHeader = () => (
  <div className="flex h-10 items-center bg-slate-200 text-xs font-medium tracking-tight text-primary/80">
    <div className="flex w-20 justify-center capitalize">ID</div>
    <div className="w-64 ps-2 capitalize">Event Name</div>
    <div className="flex w-24 justify-center capitalize">Status</div>
    <div className="flex w-32 justify-center capitalize">event date</div>
    <div className="flex w-32 justify-center capitalize">start time</div>
    <div className="flex w-24 justify-center capitalize">event type</div>
    <div className="flex w-56 justify-center capitalize">site</div>
    <div className="flex w-28 justify-end pe-2 capitalize">tickets</div>
    <div className="flex w-28 justify-end pe-2 capitalize">price</div>
    <div className="flex flex-1 justify-end px-4 capitalize"></div>
  </div>
);
