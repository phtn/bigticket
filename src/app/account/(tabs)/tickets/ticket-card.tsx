import { useMoment } from "@/hooks/useMoment";
import type { AccountTicket } from "convex/events/d";
import { useCallback, useRef } from "react";
import { useTicketViewer } from "./ctx";
import { TicketStack } from "@/ui/card/ticket";
import { motion, useInView } from "motion/react";
import { Iconx } from "@/icons";

export const TicketCard = (ticket: AccountTicket) => {
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
  });

  return (
    <motion.div
      id={ticket.ticket_id}
      ref={cardRef}
      className="relative flex h-[300px] w-full items-center justify-center rounded-sm border-primary bg-white shadow-none"
    >
      <div className="flex w-fit items-start justify-center border-[0.33px] border-macl-gray px-2">
        <TicketCardStack />
      </div>
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
