import { useAuth } from "@/app/ctx/auth/provider";
import { FloatingVaul } from "@/ui/vaul";
import { moses, secureRef } from "@/utils/crypto";
import { cn } from "@nextui-org/react";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useCartStore } from "./useCartStore";
import Link from "next/link";
import { Iconx } from "@/icons";
import { BtnIcon } from "@/ui/button";

interface CartProps {
  open: boolean;
  toggle: VoidFunction;
  className?: string;
  ticketPrice: number | undefined;
}

export const Cart = ({ open, toggle, ticketPrice }: CartProps) => {
  const [xScaling, setXScaling] = useState(false);

  const [ticketCount, setTicketCount] = useState(1);
  const searchParams = useSearchParams();
  const event_id = searchParams.get("x");

  const {
    setCount,
    setPrice,
    setTotal,
    total,
    count,
    setOrderDetails,
    setUserDetails,
    userId,
    eventId,
  } = useCartStore();

  useEffect(() => {
    setCount(ticketCount);
    if (ticketPrice) {
      setPrice(ticketPrice);
    }
    if (ticketPrice) {
      setTotal(ticketCount * ticketPrice);
    }
  }, [ticketCount, setCount, setPrice, setTotal, ticketPrice]);

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
  const refNo = moses(("b" + secureRef(8) + "t").toUpperCase());

  useEffect(() => {
    if (user) {
      setUserDetails({
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.user_metadata?.name as string,
        userPhone: user?.user_metadata?.phone as string,
        userAddress: user?.user_metadata?.address as string,
      });
      setOrderDetails({ refNo, code: "XXX" });
    }
  }, [event_id, user, refNo, setOrderDetails, setUserDetails]);

  return (
    <FloatingVaul open={open} onOpenChange={toggle}>
      <div className="relative mt-2 flex h-36 w-5/6 items-center justify-center overflow-hidden rounded-[28px] bg-primary p-0.5 md:w-[24rem]">
        <div className="group/float relative z-50 m-1 flex size-full flex-col items-center justify-center rounded-[23px] bg-primary px-2 pb-3 transition-all duration-5000 ease-in-out">
          <div className="absolute h-[24] w-full rotate-[18deg] scale-80 bg-teal-200/10 opacity-100 blur-xl transition-all delay-1000 duration-5000 ease-in-out group-hover/float:h-10 group-hover/float:rotate-[20deg] group-hover/float:scale-150" />
          <div className="absolute h-px w-full rotate-[18deg] scale-80 bg-teal-200/10 opacity-100 blur transition-all delay-200 duration-5000 ease-in-out group-hover/float:h-32 group-hover/float:rotate-[175deg] group-hover/float:scale-150" />
          <div className="absolute h-1 w-full rotate-[155deg] scale-125 bg-teal-100/20 opacity-0 blur transition-all delay-500 duration-5000 ease-in-out group-hover/float:h-14 group-hover/float:rotate-[500deg] group-hover/float:scale-150 group-hover/float:opacity-60" />
          <div className="flex w-full items-center justify-end space-y-2 px-1 font-inter text-white">
            <Link href={`/order/?u=${userId}&x=${eventId}&r=${refNo}`}>
              <div className="group/checkout relative z-50 my-3 flex items-center space-x-1 rounded-xl px-3 py-1.5 font-bold italic tracking-tighter shadow-none transition-all duration-300 active:scale-90">
                <div>
                  <span className="font-extrabold">Checkout</span>
                </div>
                <Iconx
                  name="double-arrow"
                  className="transform-all -mb-0.5 size-5 text-teal-200 duration-1000 ease-out group-hover/checkout:translate-x-1 group-hover/checkout:text-teal-100"
                />
              </div>
            </Link>
          </div>
          <div className="relative z-50 flex size-full items-center justify-between rounded-[23px] border-[0.33px] border-teal-50/10 bg-primary px-4">
            <NumberFlowGroup>
              <div
                className={cn(
                  "relative flex items-center space-x-10 font-semibold leading-none",
                )}
              >
                <div className="relative">
                  <Iconx
                    name="multiply"
                    className={cn(
                      "absolute -right-2 bottom-1 z-50 size-3.5 text-peach transition-all duration-400",
                      { "translate-x-[3px]": count >= 10 },
                      { "translate-x-[3.5px]": count >= 20 },
                      { "scale-150 text-orange-300": xScaling },
                    )}
                  />
                  <NumberFlow
                    value={count}
                    locales="en-US"
                    className="flex w-7 shrink-0 grow-0 items-center justify-center rounded-lg font-sans text-[16px] font-medium text-slate-200"
                  />
                </div>
                <div
                  className={cn("flex w-20 items-center justify-end md:w-24", {
                    "md:w-28": total > 20000,
                  })}
                >
                  <NumberFlow
                    willChange
                    className={cn(
                      "w-fit rounded-lg px-2 text-right font-inter text-lg font-medium tracking-tight text-teal-200",
                    )}
                    value={total}
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
              <BtnIcon
                onClick={incdec(-1)}
                icon="minus-sign"
                bg="text-white opacity-100 group-hover/icon:text-white group-hover/icon:opacity-100"
                color="text-primary font-bold"
              />

              <BtnIcon
                onClick={incdec(1)}
                icon="plus-sign"
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
