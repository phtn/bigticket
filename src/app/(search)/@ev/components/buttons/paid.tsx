import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { ButtonIcon } from "@/ui/button";
import NumberFlow, { continuous, NumberFlowGroup } from "@number-flow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type GetTicketButtonProps } from "..";

export const GetTicketButton = ({ ticket_value, h }: GetTicketButtonProps) => {
  const [debounced, setDebounced] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [xScaling, setXScaling] = useState(false);

  const ticketValue = useMemo(() => ticket_value ?? 0, [ticket_value]);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!debounced) {
        setDebounced(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [debounced]);

  return (
    <div className={cn("z-1 relative h-full bg-primary")} style={{ height: h }}>
      <PaidButtonX
        h={h}
        price={ticketValue}
        count={ticketCount}
        fn={incDecCount}
        xScaling={xScaling}
      />
    </div>
  );
};

interface PaidButtonProps {
  price: number;
  count: number;
  fn: (v: number) => () => void;
  h: string;
  xScaling: boolean;
}
const PaidButtonX = ({ price, count, fn, h, xScaling }: PaidButtonProps) => {
  return (
    <div
      className={cn("z-1 relative flex h-full bg-primary")}
      style={{ height: h }}
    >
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
                "w-16 text-right font-sans font-light tracking-tight text-teal-300",
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
