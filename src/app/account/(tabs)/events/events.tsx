"use client";

import { HyperList } from "@/ui/list";
import { opts } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { use, useCallback } from "react";
import { EventCardAccount } from "./event-card";
import { cn } from "@/lib/utils";
import { Count, EmptyList, Header } from "../../_components_/common";
import { SidebarCtx } from "@/app/ctx/sidebar";
import { PreloadedEventsCtx } from "@/app/ctx/event/";
import { CreateEvent } from "./create";

export const Events = () => {
  const { signedEvents, pending } = use(PreloadedEventsCtx)!;
  const { open } = use(SidebarCtx)!;

  const Counter = useCallback(() => {
    const options = opts(
      <Spinner size="sm" />,
      <Count count={signedEvents?.length} />,
    );
    return <>{options.get(pending)}</>;
  }, [pending, signedEvents?.length]);

  return (
    <div className="min-h-[80vh] w-full justify-center rounded-none border-t border-primary/20 bg-white pb-10 md:rounded-lg md:px-6">
      <div className="bg-white">
        <div key={"x"} className="flex items-center gap-4 pe-4 md:pt-4">
          <Header title="My Events">
            <Counter />
          </Header>
          <CreateEvent />
        </div>
        <HyperList
          data={signedEvents}
          component={EventCardAccount}
          container={cn(
            "relative grid grid-cols-1 px-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:px-4",
            { "z-50": !open },
          )}
        />
        {signedEvents?.length === 0 ? (
          <EmptyList
            title="My events"
            count={signedEvents?.length ?? 0}
            message="You have no events yet."
          />
        ) : null}
      </div>
    </div>
  );
};
