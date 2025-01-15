"use client";

import type { ClassName } from "@/app/types";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { log } from "@/utils/logger";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useCallback, type ReactNode } from "react";

interface BrandProps {
  className?: ClassName;
  children?: ReactNode;
}
export const Brand = ({ className, children }: BrandProps) => {
  return (
    <div
      className={cn(
        "hidden h-full w-[370px] items-center justify-between bg-white p-3 md:flex",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const HotDealsButton = () => {
  const handleClick = useCallback(() => {
    log("Hot", 0);
  }, []);

  return (
    <Button
      size="sm"
      isIconOnly
      radius="full"
      color="secondary"
      className="group bg-ghost text-gray-400 hover:bg-peach"
      onPress={handleClick}
    >
      <Icon
        name="Fire"
        className="size-4 stroke-primary-700 stroke-1 text-primary-700 group-hover:stroke-chalk group-hover:text-chalk"
      />
    </Button>
  );
};

interface BrandNameProps {
  children?: ReactNode;
}
export const BrandName = ({ children }: BrandNameProps) => (
  <div className="flex h-12 items-center">{children}</div>
);

export const Tickets = () => (
  <div className="relative left-4 z-0 flex size-6 items-center justify-center">
    <Icon
      name="TicketFill"
      className="absolute -bottom-[2px] -left-1 size-7 -rotate-[155deg] stroke-white text-macl-mint opacity-80"
    />
    <Icon
      name="TicketFill"
      className="absolute bottom-[2px] left-[3px] size-7 -rotate-[110deg] stroke-chalk text-peach"
    />
  </div>
);

export const Title = () => (
  <Link href={"/"} className="z-1 relative h-12 px-2">
    <h2 className="absolute left-[6.5px] top-[1px]">
      <span className="font-lucky text-[32px] font-bold text-white">BIG</span>
    </h2>
    <h2 className="absolute top-0 space-x-1">
      <span className="font-lucky text-3xl font-bold text-primary-800">
        BIG
      </span>
      <span className="font-cherry text-3xl font-light text-orange-400">
        ticket
      </span>
    </h2>
  </Link>
);

export const TicketsMono = () => (
  <div className="relative left-6 z-0 flex size-6 items-center justify-center">
    <Icon
      name="ShieldCheck"
      className="absolute -bottom-[2px] -left-1 hidden size-7 -rotate-[155deg] stroke-white text-macl-mint opacity-80 grayscale"
    />
    <Icon
      name="ShieldCheck"
      className="absolute -left-3 bottom-[2px] size-7 stroke-chalk stroke-0 text-indigo-400"
    />
  </div>
);

export const TitleMono = () => (
  <div className="z-1 relative left-6 h-12 px-2">
    <h2 className="absolute left-[10.5px] top-[1px]">
      <span className="font-lucky text-[32px] font-bold text-coal">BIG</span>
    </h2>
    <h2 className="absolute top-0 space-x-1">
      <span className="font-lucky text-3xl font-bold text-primary-50">BIG</span>
      <span className="font-cherry text-3xl font-light text-indigo-400 drop-shadow-sm">
        ticket
      </span>
    </h2>
  </div>
);
