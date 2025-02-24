"use client";

import { useEvents } from "@/app/_components_/home/useEvents";
import { qs } from "@/app/ctx/convex/utils";
import { PreloadedUserEventsCtx } from "@/app/ctx/event/user";
import { SidebarCtx } from "@/app/ctx/sidebar";
import { UserCtx } from "@/app/ctx/user/ctx";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { opts } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { api } from "@vx/api";
import { type SelectEvent } from "convex/events/d";
import { useQuery } from "convex/react";
import {
  type ButtonHTMLAttributes,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Count, EmptyList, Header } from "../../_components_/common";
import { CreateEvent } from "./create";
import { EventCardAccount } from "./event-card";

export const Events = () => {
  const { x, pending } = use(PreloadedUserEventsCtx)!;
  const { open } = use(SidebarCtx)!;
  const { xUser } = use(UserCtx)!;
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    if (xUser) {
      setEmail(xUser.email);
    }
  }, [xUser]);

  const [events, setEvents] = useState<SelectEvent[]>([]);
  const cohosted = useQuery(api.events.get.byCohostEmail, {
    email: qs([email ?? ""]),
  });
  useEffect(() => {
    if (email && cohosted && cohosted.length > 0) {
      setEvents(cohosted);
    }
  }, [cohosted, email]);
  const { xEvents: cohostedXEvents } = useEvents(events);

  const Counter = useCallback(() => {
    const options = opts(<Spinner size="sm" />, <Count count={x?.length} />);
    return <>{options.get(pending)}</>;
  }, [pending, x?.length]);
  const CohostCounter = useCallback(() => {
    const options = opts(
      <Spinner size="sm" />,
      <Count count={cohostedXEvents?.length} />,
    );
    return <>{options.get(pending)}</>;
  }, [pending, cohostedXEvents?.length]);

  const cohostedEventListRef = useRef<HTMLDivElement>(null);
  const handleScrollToCohosted = useCallback(() => {
    cohostedEventListRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

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
          <div key={"x"} className="flex items-center gap-4 pe-4 md:py-4">
            <Header title="My Events">
              <Counter />
              {cohostedXEvents.length > 0 && (
                <Cohosted onClick={handleScrollToCohosted} />
              )}
            </Header>
            <CreateEvent />
          </div>
        </HyperList>

        <div className="h-24 bg-white" ref={cohostedEventListRef} />
        {cohostedXEvents.length > 0 && (
          <HyperList
            data={cohostedXEvents}
            component={EventCardAccount}
            container={cn(
              "relative grid grid-cols-1 px-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:px-4",
              { "z-50": !open },
            )}
          >
            <div key={"xc"} className="flex items-center gap-4 pe-4 md:py-4">
              <Header title="Co-hosted Events">
                <CohostCounter />
              </Header>
            </div>
          </HyperList>
        )}

        {x?.length === 0 ? (
          <EmptyList icon="EventStar" message="You have no events yet." />
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
          <Icon
            name="SpinnersPulseRing"
            className="absolute size-5 text-indigo-500"
          />
          <Icon name="DotSm" className="absolute size-4 text-indigo-400" />
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
