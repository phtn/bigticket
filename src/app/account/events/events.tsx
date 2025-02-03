"use client";

import { HyperList } from "@/ui/list";
import { opts } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { use, useCallback } from "react";
import { EventCardAccount } from "./event-card";
import { cn } from "@/lib/utils";
import { Count, EmptyList, Header } from "../_components_/common";
import { SidebarCtx } from "@/app/ctx/sidebar";
import { PreloadedEventsCtx } from "@/app/ctx/event/";
import { log } from "@/utils/logger";

export const Events = () => {
  const { signedEvents, pending } = use(PreloadedEventsCtx)!;
  log("account-events", signedEvents);
  const { open } = use(SidebarCtx)!;

  const Counter = useCallback(() => {
    const options = opts(
      <Spinner size="sm" />,
      <Count count={signedEvents?.length} />,
    );
    return <>{options.get(pending)}</>;
  }, [pending, signedEvents?.length]);

  const ListOptions = useCallback(() => {
    const options = opts(
      <HyperList
        data={signedEvents}
        component={EventCardAccount}
        container={cn(
          "relative columns-1 gap-4 space-y-2 md:columns-2 xl:colums-3 md:px-4",
          { "z-50": !open },
        )}
      >
        <Header title="My Events">
          <Counter />
        </Header>
      </HyperList>,
      <EmptyList
        title="My events"
        count={signedEvents?.length ?? 0}
        message="You have no events yet."
      />,
    );
    return <>{options.get(!pending && (signedEvents?.length ?? 0) > 0)}</>;
  }, [pending, open, signedEvents, Counter]);

  return (
    <div className="min-h-[80vh] w-full justify-center rounded-none bg-white md:rounded-lg md:px-6">
      <div className="bg-white">
        <ListOptions />
      </div>
    </div>
  );
};
