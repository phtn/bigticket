"use client";

import type { ClassName } from "@/app/types";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

interface BrandProps {
  className?: ClassName;
  children?: ReactNode;
}
export const Brand = ({ className, children }: BrandProps) => {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "_md:w-[370px] hidden h-full w-1/3 items-center justify-between ps-1 md:flex",
        { flex: pathname },
        className,
      )}
    >
      {children}
    </div>
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
    <h2 className="absolute left-[6.5px] top-[2px] md:top-[1px]">
      <span className="font-lucky text-[33px] font-extrabold text-white">
        BIG
      </span>
    </h2>
    <h2 className="absolute top-0 space-x-1">
      <span className="font-lucky text-3xl font-bold tracking-[0.8px] text-primary-800">
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
