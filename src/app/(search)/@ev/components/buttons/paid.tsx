import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { ButtonIcon } from "@/ui/button";
import NumberFlow, { continuous, NumberFlowGroup } from "@number-flow/react";
import { useCallback, useMemo, useState } from "react";
import { type GetTicketProps } from "./d";

export const GetTickets = ({ ticketPrice, h }: GetTicketProps) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [xScaling, setXScaling] = useState(false);

  const ticketValue = useMemo(() => ticketPrice ?? 0, [ticketPrice]);

  const incDecCount = useCallback(
    (value: number) => () => {
      setXScaling(true);
      const timer = setTimeout(() => {
        setXScaling(false);
      }, 180);
      setTicketCount((prev) => Math.max(1, prev + value));
      return () => clearTimeout(timer);
    },
    [],
  );

  return (
    <div className={cn("z-1 relative h-full bg-primary")} style={{ height: h }}>
      <PaidButtonX
        fn={incDecCount}
        price={ticketValue}
        count={ticketCount}
        xScaling={xScaling}
      />
    </div>
  );
};

interface PaidButtonProps {
  price: number;
  count: number;
  fn: (v: number) => () => void;
  xScaling: boolean;
}
const PaidButtonX = ({ price, count, fn, xScaling }: PaidButtonProps) => {
  return (
    <div className={cn("z-1 relative flex h-full bg-primary")}>
      <div
        className={cn("flex w-full items-center justify-between px-3 md:px-6")}
      >
        <PaidTicketLabel />
        <NumberFlowGroup>
          <div className="relative flex items-center font-semibold leading-none">
            <Icon
              name="Mul"
              className={cn(
                "absolute -left-1 bottom-1 z-50 size-3 text-peach transition-all duration-400",
                { "-translate-x-[3px]": count >= 10 },
                { "-translate-x-[3.5px]": count >= 20 },
                { "scale-150 text-orange-300": xScaling },
              )}
            />
            <NumberFlow
              value={count}
              plugins={[continuous]}
              trend={0}
              locales="en-US"
              className="flex w-6 grow-0 items-center justify-center rounded bg-gray-400/20 font-sans text-sm text-slate-200"
            />
            <NumberFlow
              plugins={[continuous]}
              trend={0}
              willChange
              className={cn(
                "w-20 text-right font-sans font-medium tracking-tight text-teal-300 md:w-24",
                { "w-20": count * price > 100000 },
              )}
              value={price * count}
              format={{
                currency: "PHP",
                style: "currency",
                maximumFractionDigits: 0,
              }}
            />
          </div>
        </NumberFlowGroup>
        <div className="flex gap-1.5">
          <ButtonIcon
            onClick={fn(-1)}
            icon="Minus"
            bg="text-white opacity-100 group-hover/icon:text-white group-hover/icon:opacity-100"
            color="text-primary font-bold"
          />

          <ButtonIcon
            onClick={fn(1)}
            icon="Plus"
            bg="text-white opacity-100 group-hover/icon:text-white group-hover/icon:opacity-100"
            color="text-primary font-bold"
          />
        </div>
      </div>
    </div>
  );
};
const PaidTicketLabel = () => (
  <h2 className="space-x-0.5 text-xl font-black">
    <span className="font-bold italic tracking-tighter text-orange-300">
      Get
    </span>
    <span className="text-white">Tickets</span>
  </h2>
);
