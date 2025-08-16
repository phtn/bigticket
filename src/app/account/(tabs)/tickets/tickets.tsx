import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { opts } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { type AccountTicket } from "convex/events/d";
import { useCallback, useMemo } from "react";
import { Count, EmptyList, Header } from "../../_components_/common";
import { TicketCard } from "./ticket-card";
import { TicketViewer } from "./ticket-viewer";
import { useAccountCtx } from "@/app/ctx/accounts";

export const Tickets = () => {
  const { xAccount, isPending } = useAccountCtx();

  const ticketsByEvent = useCallback(
    (arr: AccountTicket[] | undefined): Map<string, AccountTicket[]> => {
      const map = new Map<string, AccountTicket[]>();

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
    },
    [],
  );

  const eventGroups = useMemo(
    () => ticketsByEvent(xAccount?.tickets) ?? [],
    [xAccount?.tickets, ticketsByEvent],
  );
  const groups = useMemo(
    () => Array.from(eventGroups.entries()),
    [eventGroups],
  );

  const Counter = useCallback(
    ({ count }: { count: number }) => {
      const options = opts(<Spinner size="sm" />, <Count count={count} />);
      return <>{options.get(isPending)}</>;
    },
    [isPending],
  );

  return (
    <div className="min-h-[80vh] w-full justify-center rounded-none border-t border-primary/20 bg-white pb-10 md:rounded-lg md:px-6">
      <div className="bg-white">
        {groups.map((group) => (
          <div key={`_${group[0]}`}>
            <HyperList
              data={group[1]}
              component={TicketCard}
              keyId="ticket_id"
              container={cn(
                "relative grid grid-cols-1 pb-44 pt-4 px-4 portrait:gap-y-24 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:px-4",
                { "z-50": !open },
              )}
            >
              <div key={"x"} className="md:rounded-t-md">
                <Header title={String(group[0])}>
                  {xAccount ? (
                    <Counter count={group[1].length} />
                  ) : (
                    <Spinner size="sm" />
                  )}
                </Header>
              </div>
            </HyperList>
          </div>
        ))}

        {groups.length === 0 ? (
          <EmptyList
            icon="ticket-tilted"
            message={
              isPending ? "Getting your tickets..." : "You have no tickets yet."
            }
            loading={isPending}
          />
        ) : null}
        <TicketViewer />
      </div>
    </div>
  );
};
