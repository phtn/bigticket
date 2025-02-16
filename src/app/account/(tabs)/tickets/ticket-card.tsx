import { useMoment } from "@/hooks/useMoment";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { Card, CardFooter, CardHeader, Spinner } from "@nextui-org/react";
import type { UserTicket } from "convex/events/d";
// import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { QrCodeGen } from "../../_components_/qr";

export const TicketCard = (ticket: UserTicket) => {
  const { event_date, event_day, start_time, end_time } = useMoment({
    start: ticket.event_start,
    end: ticket.event_end,
  });
  // const router = useRouter();
  const handleViewScannable = useCallback(() => {
    // router.push(ticket.ticket_url!);
    console.log(ticket.ticket_url);
  }, [ticket.ticket_url]);

  return (
    <Card
      isFooterBlurred
      className="flex h-[360px] w-full items-center justify-center rounded-sm bg-peach/10"
    >
      <CardHeader className="absolute top-0 z-10 flex w-full items-start justify-between gap-3 rounded-none bg-peach ps-4 backdrop-blur-sm">
        <section className="flex w-full items-center justify-between">
          <h4 className="font-mono font-thin uppercase tracking-widest text-primary">
            Admit one
          </h4>
          <div className="flex items-center gap-2">
            <p className="max-w-[45ch] text-tiny font-bold uppercase">
              {ticket.event_name}
            </p>
            <Icon name="VIPIcon" className="size-6" />
          </div>
        </section>
      </CardHeader>
      <div className="flex w-fit items-start justify-center px-2">
        <QrCodeGen
          url={ticket.ticket_url}
          logo="/icon/logomark_v2.svg"
          width={180}
          height={180}
        />
      </div>
      <CardFooter className="absolute bottom-0 z-10 w-full rounded-none border-t-1 border-primary bg-primary">
        <div className="flex flex-grow items-center gap-2 bg-primary">
          {/* <Image
              alt="Breathing app icon"
              className="h-24 w-full rounded-full"
              src={cover_url}
            /> */}
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-tiny capitalize text-secondary drop-shadow-sm">
              <span
                className={cn("lowercase text-secondary", {
                  "text-peach": !ticket?.is_active,
                })}
              >
                {`${ticket.ticket_index} / ${ticket.ticket_count}`}
              </span>
            </p>
            <div className="space-x-1 text-tiny uppercase text-gray-200">
              <span className="drop-shadow-md">
                {event_day.substring(0, 3)}
              </span>
              <span>&middot;</span>
              <span className="drop-shadow-md">
                {event_date.substring(0, event_date.indexOf(","))}
              </span>
              <span>&middot;</span>
              <span className="drop-shadow-md">
                {start_time.compact}-{end_time.compact}
              </span>
            </div>
          </div>
        </div>
        <button
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            "bg-gray-500/60 hover:bg-teal-400",
            "active:scale-95 active:opacity-90",
            "group/btn transition-all duration-300",
          )}
          disabled={!ticket}
          onClick={handleViewScannable}
        >
          {!ticket ? (
            <Spinner size="sm" color="default" />
          ) : (
            <Icon
              name="QrCode"
              className="size-5 text-chalk shadow-coal drop-shadow-sm group-hover/btn:text-white"
            />
          )}
        </button>
      </CardFooter>
    </Card>
  );
};
