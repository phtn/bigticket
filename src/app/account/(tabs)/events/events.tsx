"use client";

import { usePreloadedUserEvents } from "@/app/ctx/event/user";
import { useSidebar } from "@/app/ctx/sidebar";
import { useUserCtx } from "@/app/ctx/user";
import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { opts } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { type ButtonHTMLAttributes, useCallback, useRef } from "react";
import { Count, EmptyList, Header } from "../../_components_/common";
import { CreateEvent } from "./create";
import { EventCardAccount } from "./event-card";
import { CohostedEventCard } from "./cohost-card";
import { useUserEvents } from "./useUserEvents";
import { Iconx } from "@/icons";

export const Events = () => {
  const { x, pending } = usePreloadedUserEvents();
  const { open } = useSidebar();
  const { xUser } = useUserCtx();
  const { cohostedXEvents, loading } = useUserEvents(xUser?.email);

  const Counter = useCallback(() => {
    const options = opts(<Spinner size="sm" />, <Count count={x?.length} />);
    return <>{options.get(pending)}</>;
  }, [pending, x?.length]);

  const CohostCounter = useCallback(() => {
    const options = opts(
      <Spinner size="sm" />,
      <Count count={cohostedXEvents?.length} />,
    );
    return <>{options.get(loading)}</>;
  }, [loading, cohostedXEvents?.length]);

  const cohostedEventListRef = useRef<HTMLDivElement>(null);

  const handleScrollToCohosted = useCallback(() => {
    cohostedEventListRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <div className="min-h-[80vh] w-full justify-center rounded-none border-t border-primary/20 bg-white pb-64 md:rounded-lg md:px-6">
      <div className="bg-white">
        <HyperList
          data={x}
          component={EventCardAccount}
          container={cn(
            "relative grid grid-cols-1 px-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:px-4",
            { "z-50": !open },
          )}
        >
          <div key={"x"} className="flex items-center gap-4 pe-4 md:py-4">
            <Header title="My Events">
              <Counter />
              {x && x?.length > 0 && (
                <Cohosted onClick={handleScrollToCohosted} />
              )}
            </Header>
            <CreateEvent />
          </div>
        </HyperList>

        <div className="h-24 bg-white" ref={cohostedEventListRef} />
        <HyperList
          data={cohostedXEvents}
          component={CohostedEventCard}
          container={cn(
            "relative grid grid-cols-1 px-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:px-4",
            { "z-50": !open },
          )}
        >
          <div key={"xc"} className="flex items-center gap-4 pe-4 md:py-4">
            <Header title="Co-hosted Events">{<CohostCounter />}</Header>
          </div>
        </HyperList>

        {x?.length === 0 ? (
          <EmptyList
            className="-top-24"
            icon="event"
            message="You have no events yet."
          />
        ) : null}
      </div>
    </div>
  );
};

const Cohosted = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <div className="ml-4 animate-enter delay-500">
      <button
        {...props}
        className="group/cohost flex size-6 h-7 w-fit items-center justify-center rounded-lg bg-gray-200/50 px-0 pe-2 text-primary hover:bg-gray-200/70 md:h-8 md:gap-1 md:ps-2"
      >
        <div className="relative flex size-5 items-center justify-center">
          <Iconx
            name="spinners-pulse-rings-multiple"
            className="absolute size-5 text-indigo-500"
          />
        </div>
        <span
          className={cn(
            "font-inter text-sm font-medium capitalize tracking-tighter text-indigo-500 md:flex",
          )}
        >
          Co-hosted
        </span>
      </button>
    </div>
  );
};
