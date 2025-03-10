import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { ButtonIcon } from "@/ui/button";
import NumberFlow, { continuous, NumberFlowGroup } from "@number-flow/react";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { type GetTicketProps } from "./d";
import { FloatingVaul } from "@/ui/vaul";
import { useCheckout } from "./checkout/ctx";
import { useAuth } from "@/app/ctx/auth/provider";
import { onError, onWarn } from "@/app/ctx/toast";
import { useSearchParams } from "next/navigation";

export const GetTickets = ({ ticketPrice, h }: GetTicketProps) => {
  const { open, toggle } = useCheckout();
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
        className={cn("flex w-full items-center justify-evenly px-3 md:px-6")}
      >
        <NumberFlowGroup>
          <div
            className={cn(
              "relative flex items-center font-semibold leading-none md:gap-0",
            )}
          >
            <div className={cn("flex items-center justify-end", {})}>
              <Icon name="Ticket" className="size-5 text-teal-400" />
              <NumberFlow
                plugins={[continuous]}
                trend={0}
                willChange
                className={cn(
                  "w-fit rounded-lg px-2 text-right font-sans text-xl tracking-tight text-teal-50",
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
    className="flex items-center space-x-1 text-xl font-black"
  >
    <span className="font-bold italic tracking-tighter text-orange-300">
      Get
    </span>
    <span className="text-white">Tickets</span>
    <Icon
      name="ArrowRightDouble"
      className="relative -left-1 size-7 text-secondary"
    />
  </button>
);

interface CheckoutProps {
  open: boolean;
  toggle: VoidFunction;
  className?: string;
  ticketPrice: number | undefined;
}

export const Checkout = ({ open, toggle, ticketPrice }: CheckoutProps) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [xScaling, setXScaling] = useState(false);
  const searchParams = useSearchParams();
  const event_id = searchParams.get("x");

  const totalAmount = useMemo(
    () => ticketCount * (ticketPrice ?? 1),
    [ticketPrice, ticketCount],
  );

  const incdec = useCallback(
    (value: number) => () => {
      if (!open) {
        toggle();
      }
      setXScaling(true);
      const timer = setTimeout(() => {
        setXScaling(false);
      }, 180);
      setTicketCount((prev) => Math.max(1, prev + value));
      return () => clearTimeout(timer);
    },
    [toggle, open],
  );

  const { user } = useAuth();

  const handleCheckout = useCallback(() => {
    if (!user) {
      onWarn("Login to proceed to checkout.");
    }
    if (!event_id) {
      onError("Event ID is missing");
    }
    console.table({ event_id, user_id: user?.id, totalAmount, ticketCount });
  }, [user, event_id, totalAmount, ticketCount]);

  return (
    <FloatingVaul open={open} onOpenChange={toggle} dismissible modal={false}>
      <div className="relative mt-2 flex h-36 w-4/5 items-center justify-center overflow-hidden rounded-[28px] bg-primary p-0.5">
        <div className="group/float relative z-50 m-1 flex size-full flex-col items-center justify-center rounded-[23px] bg-primary px-2 pb-3">
          <div className="duration-5000 absolute h-px w-full rotate-[18deg] scale-80 bg-teal-200/10 opacity-100 blur transition-all delay-300 ease-in-out group-hover/float:h-32 group-hover/float:rotate-[350deg] group-hover/float:scale-150" />
          <div className="duration-3000 absolute h-1 w-full rotate-[155deg] scale-125 bg-teal-100/20 opacity-0 blur transition-all delay-500 ease-in group-hover/float:h-24 group-hover/float:rotate-[450deg] group-hover/float:scale-150 group-hover/float:opacity-60" />
          <div className="flex w-full items-center justify-end space-y-2 text-white">
            <button
              onClick={handleCheckout}
              className="relative z-50 flex items-center space-x-1 px-3 py-5 font-bold italic tracking-tighter transition-all duration-300 active:scale-90"
            >
              <div>Proceed to Checkout</div>
              <Icon name="ArrowRightDouble" className="size-5 text-teal-200" />
            </button>
          </div>
          <div className="relative z-50 flex size-full items-center justify-between rounded-[23px] border-0 border-secondary bg-primary px-4">
            <NumberFlowGroup>
              <div
                className={cn(
                  "relative flex items-center space-x-10 font-semibold leading-none",
                )}
              >
                <div className="relative">
                  <Icon
                    name="Mul"
                    className={cn(
                      "absolute -right-2 bottom-1 z-50 size-3.5 text-peach transition-all duration-400",
                      { "translate-x-[3px]": ticketCount >= 10 },
                      { "translate-x-[3.5px]": ticketCount >= 20 },
                      { "scale-150 text-orange-300": xScaling },
                    )}
                  />
                  <NumberFlow
                    value={ticketCount}
                    plugins={[continuous]}
                    trend={0}
                    locales="en-US"
                    className="flex w-7 shrink-0 grow-0 items-center justify-center rounded-lg bg-gray-400/10 font-sans text-[16px] font-medium text-slate-200"
                  />
                </div>
                <div
                  className={cn("flex w-20 items-center justify-end md:w-24", {
                    "md:w-28": totalAmount > 20000,
                  })}
                >
                  <NumberFlow
                    plugins={[continuous]}
                    trend={0}
                    willChange
                    className={cn(
                      "w-fit rounded-lg bg-gray-500/10 px-2 text-right font-sans text-lg font-medium tracking-tight text-teal-300",
                    )}
                    value={totalAmount}
                    format={{
                      currency: "PHP",
                      style: "currency",
                      maximumFractionDigits: 0,
                    }}
                  />
                </div>
              </div>
            </NumberFlowGroup>
            <div className="flex items-center justify-center space-x-4">
              <ButtonIcon
                onClick={incdec(-1)}
                icon="Minus"
                bg="text-white opacity-100 group-hover/icon:text-white group-hover/icon:opacity-100"
                color="text-primary font-bold"
              />

              <ButtonIcon
                onClick={incdec(1)}
                icon="Plus"
                bg="text-white opacity-100 group-hover/icon:text-white group-hover/icon:opacity-100"
                color="text-primary font-bold"
              />
            </div>
          </div>
        </div>
      </div>
    </FloatingVaul>
  );
};
