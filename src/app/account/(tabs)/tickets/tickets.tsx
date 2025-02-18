import { Count, EmptyList, Header } from "../../_components_/common";
import { use, useCallback, useMemo } from "react";
import { VxCtx } from "@/app/ctx/convex/vx";
import { type UserTicket } from "convex/events/d";
import { HyperList } from "@/ui/list";
import { cn } from "@/lib/utils";
import { TicketCard } from "./ticket-card";
import { Spinner } from "@nextui-org/react";
import { opts } from "@/utils/helpers";

export const Tickets = () => {
  const { vx, pending } = use(VxCtx)!;



  function ticketsByEvent(arr: UserTicket[] | undefined): Map<string, UserTicket[]> {
    const map = new Map<string, UserTicket[]>();

    if (!arr) {
      return map;
    }

    arr.forEach((item) => {
      if (!map.has(item.event_name)) {
        map.set(item.event_name, []);
      }
      map.get(item.event_name)!.push(item);
    });

    return map;
  }

  const eventGroups = useMemo(() => ticketsByEvent(vx?.tickets) ?? [], [vx?.tickets]);
  const groups = useMemo(() => Array.from(eventGroups.entries()), [eventGroups]);

  const Counter = useCallback(({ count }: { count: number }) => {
    const options = opts(
      <Spinner size="sm" />,
      <Count count={count} />,
    );
    return <>{options.get(pending)}</>;
  }, [pending]);



  return (
    <div className="min-h-[80vh] w-full justify-center rounded-none border-t border-primary/20 bg-white pb-10 md:rounded-lg md:px-6">
      <div className="bg-white">
        {groups.map((group, i) => (
          <div key={`_${group[0]}`}>
            <HyperList
              data={group[1]}
              component={TicketCard}
              keyId="ticket_id"
              container={cn(
                "relative grid grid-cols-1 pb-10 px-4 portrait:gap-y-24 gap-4 md:gap-6 sm:grid-cols-3 lg:grid-cols-4 md:px-4",
                { "z-50": !open },
              )}
            >
              <div key={i} className="md:rounded-t-md">
                <Header title={String(group[0])}>
                  {vx ? <Counter count={group[1].length} /> : <Spinner size="sm" />}
                </Header>
              </div>
            </HyperList>
          </div>
        ))}

        {groups.length === 0 ? (
          <EmptyList
            title="My Tickets"
            count={0}
            message="You have no tickets yet."
            loading={pending}
          />
        ) :
          <Header title="My Tickets"></Header>
        }
      </div>
    </div>
  );
};
