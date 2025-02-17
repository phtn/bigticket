import { Count, EmptyList, Header } from "../../_components_/common";
import { use } from "react";
import { VxCtx } from "@/app/ctx/convex/vx";
import { type UserTicket } from "convex/events/d";
import { HyperList } from "@/ui/list";
import { cn } from "@/lib/utils";
import { TicketCard } from "./ticket-card";

export const Tickets = () => {
  const { vx } = use(VxCtx)!;

  const ticketsByEvent = (
    arr: UserTicket[] | undefined,
  ): Map<string, UserTicket[]> | [] => {
    const map = new Map<string, UserTicket[]>();

    arr?.forEach((item) => {
      if (!map.has(item.event_name)) {
        map.set(item.event_name, []);
      }
      map.get(item.event_name)!.push(item);
    });
    return map;
  };

  const eventGroups = ticketsByEvent(vx?.tickets) ?? [];

  return (
    <div className="min-h-[80vh] w-full justify-center rounded-none border-t border-primary/20 bg-white pb-10 md:rounded-lg md:px-6">
      <div className="bg-white">
        {Array.from(eventGroups).map(([event_name, tickets], i) => (
          <div key={`${tickets[i]?.ticket_id}`}>
            <HyperList
              data={tickets}
              component={TicketCard}
              keyId="ticket_id"
              container={cn(
                "relative grid grid-cols-1 pb-10 px-4 portrait:gap-y-24 gap-4 md:gap-6 sm:grid-cols-3 lg:grid-cols-4 md:px-4",
                { "z-50": !open },
              )}
            >
              <div className="md:rounded-t-md">
                <Header title={String(event_name)}>
                  <Count count={tickets.length}></Count>
                </Header>
              </div>
            </HyperList>
          </div>
        ))}

        {Array.from(eventGroups).length === 0 ? (
          <EmptyList
            title="My tickets"
            count={Array.from(eventGroups).length ?? 0}
            message="You have no tickets yet."
          />
        ) : null}
      </div>
    </div>
  );
};
