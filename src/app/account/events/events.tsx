"use client";

import { HyperList } from "@/ui/list";
import { opts } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { use, useCallback } from "react";
import { EventCardAccount } from "./event-card";
import { cn } from "@/lib/utils";
import { Count, Header } from "../_components_/common";
import { EventCtx, EventCtxProvider } from "../events/ctx";
import { SidebarCtx } from "@/app/ctx/sidebar";

export const Events = () => (
  <EventCtxProvider>
    <EventsContent />
  </EventCtxProvider>
);

const EventsContent = () => {
  const { eventList, pending } = use(EventCtx)!;
  const { open } = use(SidebarCtx)!;

  const Counter = useCallback(() => {
    const options = opts(
      <Spinner size="sm" />,
      <Count count={eventList?.length} />,
    );
    return <>{options.get(pending)}</>;
  }, [pending, eventList?.length]);

  return (
    <div className="min-h-[80vh] w-full justify-center rounded-none bg-white md:rounded-lg md:px-6">
      <div className="overflow-auto bg-white">
        <HyperList
          keyId="event_id"
          data={eventList}
          component={EventCardAccount}
          container={cn(
            "relative columns-1 gap-4 space-y-2 md:columns-2 xl:colums-3 md:px-4",
            { "z-50": !open },
          )}
        >
          <Header title="My Events">
            <Counter />
          </Header>
        </HyperList>
      </div>
    </div>
  );
};
