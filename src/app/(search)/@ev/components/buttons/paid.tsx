"use client";

import { cn } from "@/lib/utils";
import NumberFlow, { continuous, NumberFlowGroup } from "@number-flow/react";
import { type ReactNode, useCallback } from "react";
import { useCart } from "./cart/ctx";
import { type GetTicketProps } from "./d";
import { Iconx } from "@/icons";

export const GetTickets = ({ ticketPrice, h }: GetTicketProps) => {
  const { open, toggle } = useCart();
  const toggleTicketAdder = useCallback(() => {
    if (!open) {
      toggle();
    }
  }, [open, toggle]);

  return (
    <div className={cn("z-1 relative h-full bg-primary")} style={{ height: h }}>
      <PaidButtonX price={ticketPrice}>
        <TicketAdder fn={toggleTicketAdder} />
      </PaidButtonX>
    </div>
  );
};

interface PaidButtonProps {
  price: number | undefined;
  children: ReactNode;
}
const PaidButtonX = ({ price, children }: PaidButtonProps) => {
  return (
    <div className={cn("z-1 relative flex h-full bg-primary")}>
      <div
        className={cn("flex w-full items-center justify-around px-3 md:px-6")}
      >
        <NumberFlowGroup>
          <div
            className={cn(
              "relative flex items-center font-semibold leading-none md:gap-0",
            )}
          >
            <div className={cn("flex items-center justify-end", {})}>
              <Iconx
                name="ticket-tilted"
                className="size-5 animate-enter text-teal-400 delay-300"
              />
              <NumberFlow
                plugins={[continuous]}
                trend={0}
                willChange
                className={cn(
                  "font-geist w-fit animate-enter rounded-lg px-2 text-right text-xl tracking-tighter text-teal-50 delay-150",
                )}
                value={price ?? 0}
                format={{
                  currency: "PHP",
                  style: "currency",
                  maximumFractionDigits: 0,
                }}
              />
            </div>
          </div>
        </NumberFlowGroup>
        {children}
      </div>
    </div>
  );
};

interface TicketAdderProps {
  fn: VoidFunction;
}

const TicketAdder = ({ fn }: TicketAdderProps) => (
  <button
    onClick={fn}
    className="flex items-center space-x-1 text-xl font-black transition-all duration-300 active:scale-90"
  >
    <span className="animate-enter font-bold italic tracking-tighter text-orange-300">
      Get
    </span>
    <span className="animate-enter text-white delay-150">Tickets</span>
    <Iconx
      name="chevron-double-right"
      className="relative -left-1 -mb-[1px] size-[26px] animate-enter text-secondary delay-300"
    />
  </button>
);
