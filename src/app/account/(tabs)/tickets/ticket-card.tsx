import { useMoment } from "@/hooks/useMoment";
import type { UserTicket } from "convex/events/d";
import { useCallback, useRef } from "react";
import { useTicketViewer } from "./ctx";
import { TicketStack } from "@/ui/card/ticket";
import { motion, useInView } from "motion/react";
import { Iconx } from "@/icons/icon";

export const TicketCard = (ticket: UserTicket) => {
  const { event_time, compact, event_day } = useMoment({
    start: ticket.event_start,
    end: ticket.event_end,
  });

  const { toggle, getTicket } = useTicketViewer();

  const handleViewScannable = useCallback(() => {
    if (!ticket) return;
    getTicket(ticket);
    toggle();
  }, [ticket, getTicket, toggle]);

  const TicketCardStack = useCallback(() => {
    return (
      <TicketStack
        title={ticket.event_name}
        date={compact}
        time={event_time.compact}
        site={ticket.ticket_url?.substring(0, 6)}
        day={event_day}
        tickets={ticket.ticket_count}
        color={ticket.is_used ? "bg-secondary" : "bg-macd-mint/60"}
      />
    );
  }, [ticket, compact, event_time, event_day]);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(cardRef, {
    once: false, // Animation repeats if scrolled in/out multiple times
    amount: 0.3, // Card needs to be 30% in view to trigger
    // margin: "0px 0px -100px 0px", // Adjust trigger area if needed
  });

  return (
    <motion.div
      id={ticket.ticket_id}
      ref={cardRef}
      className="relative flex h-[300px] w-full items-center justify-center rounded-sm border-primary bg-white shadow-none"
    >
      {/* <CardHeader
        className={cn(
          "absolute top-0 z-10 flex w-full items-start justify-between gap-3 rounded-none bg-peach backdrop-blur-sm",
          { "bg-teal-500": ticket?.is_used },
        )}
      >
        <section className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="VIPIcon" className="size-9 text-white" />
            <p className="max-w-[16ch] text-left text-tiny font-medium capitalize leading-[14px] text-gray-100">
              {ticket.event_name}
            </p>
          </div>
          <div className="relative flex h-full items-center justify-center">
            {ticket.is_used ? (
              <h4
                className={cn(
                  "relative max-w-[7ch] text-center font-inter font-bold uppercase leading-none tracking-tighter text-white",
                )}
              >
                Ticket scanned
                <Icon
                  name="Check"
                  className="absolute -right-1 -top-0 text-white drop-shadow-sm"
                />
              </h4>
            ) : (
              <h4
                className={cn(
                  "max-w-[5ch] text-center font-inter font-bold uppercase leading-none tracking-tighter text-white",
                )}
              >
                Admit one
              </h4>
            )}
          </div>
        </section>
      </CardHeader> */}
      <div className="flex w-fit items-start justify-center border-[0.33px] border-macl-gray px-2">
        <TicketCardStack />
        {/* <QrCodeGen
          url={ticket.ticket_url}
          logo="/icon/logomark_v2.svg"
          width={180}
          height={180}
        /> */}
      </div>
      {/* The Button that slides up */}
      <motion.button
        onClick={handleViewScannable}
        className="absolute bottom-10 right-3 flex size-10 items-center justify-center rounded-full bg-peach py-3 text-white"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{
          scale: isInView ? 1 : 0.5, // Slides up further when leaving view
          opacity: isInView ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: isInView ? "easeOut" : "easeIn", // Different easing for entry/exit
        }}
      >
        <Iconx name="qr-code" className="size-5" />
      </motion.button>
    </motion.div>
  );
};

/*
<CardFooter className="absolute bottom-0 z-10 hidden w-full rounded-none border-t-1 border-primary bg-primary">
        <div className="flex flex-grow items-center bg-primary">
          <div className="space-y-1">
            <p className="flex items-center gap-4 text-tiny capitalize text-secondary drop-shadow-sm">
              <span
                className={cn("lowercase text-secondary", {
                  "text-peach": !ticket?.is_active,
                })}
              >
                {`${ticket.ticket_index}/${ticket.ticket_count}`}
              </span>
              <span className="font-bold text-gray-400">Ticket number </span>
              <span>&rarr;</span>
              <span className="font-mono text-gray-300">
                {ticket.ticket_id.split("-")[0]}
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
*/
