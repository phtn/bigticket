import { EventCard } from "@/app/_components/home/components/event-card";
import { Sidebar } from "@/app/_components/home/components/sidebar";
import { VxCtx } from "@/app/ctx/convex/vx";
import { Icon } from "@/icons";
import { HyperList } from "@/ui/list";
import { opts } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { type PropsWithChildren, use, useCallback } from "react";

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
    <div className="min-h-[80vh] w-full justify-center space-y-1 rounded-none bg-white pt-3 md:space-y-3 md:rounded-lg md:px-6">
      <Sidebar className="pointer-events-auto fixed top-12 z-[200] -translate-x-[380px]" />

      <div className="overflow-auto bg-white">
        <HyperList
          keyId="event_id"
          data={vxEvents}
          component={EventCard}
          container="columns-1 gap-4 space-y-2 md:columns-2 xl:colums-3 md:px-4"
        >
          <Header>
            <Counter />
          </Header>
        </HyperList>
      </div>
    </div>
  );
};

const Header = ({ children }: PropsWithChildren) => (
  <section className="flex items-center gap-2 pb-2">
    <h1 className="ps-4 font-semibold tracking-tighter md:text-2xl">
      My Events
    </h1>
    {children}
  </section>
);

const Count = (props: { count: number | undefined }) => (
  <div className="relative flex size-8 items-center justify-center">
    <Icon name="Squircle" className="absolute z-0 size-6 text-void md:size-8" />
    <p className="z-1 relative text-sm font-semibold text-chalk md:text-[16px]">
      {props.count}
    </p>
  </div>
);

/*
<HyperList
            data={vxEvents}
            component={EventItem}
            container="overflow-x-scroll"
            keyId="updated_at"
            itemStyle="border-t border-primary/60  "
          >
            <EventTableHeader />
          </HyperList>
*/
