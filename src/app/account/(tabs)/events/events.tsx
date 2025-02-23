"use client";

import { PreloadedUserEventsCtx } from "@/app/ctx/event/user";
import { SidebarCtx } from "@/app/ctx/sidebar";
import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { opts } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { use, useCallback } from "react";
import { Count, EmptyList, Header } from "../../_components_/common";
import { CreateEvent } from "./create";
import { EventCardAccount } from "./event-card";

export const Events = () => {
  const { x, pending } = use(PreloadedUserEventsCtx)!;
  const { open } = use(SidebarCtx)!;

  const Counter = useCallback(() => {
    const options = opts(<Spinner size="sm" />, <Count count={x?.length} />);
    return <>{options.get(pending)}</>;
  }, [pending, x?.length]);

  return (
    <div className="min-h-[80vh] w-full justify-center rounded-none border-t border-primary/20 bg-white pb-10 md:rounded-lg md:px-6">
      <div className="bg-white">
        <HyperList
          data={x}
          component={EventCardAccount}
          container={cn(
            "relative grid grid-cols-1 px-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:px-4",
            { "z-50": !open },
          )}
        >
          <div key={"x"} className="flex items-center gap-4 pe-4 md:pt-4">
            <Header title="My Events">
              <Counter />
            </Header>
            <CreateEvent />
          </div>
        </HyperList>
        {x?.length === 0 ? (
          <EmptyList icon="EventStar" message="You have no events yet." />
        ) : null}
      </div>
    </div>
  );
};
