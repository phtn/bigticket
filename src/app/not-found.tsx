"use client";

import { cn } from "@/lib/utils";
import { Image } from "@nextui-org/react";

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-64px)] w-[calc(100vw)] flex-col items-center justify-center space-y-10 border-t-[0.33px] border-gray-400 bg-void">
      <div className="relative flex">
        <Orbiter />
      </div>
      <div className="h-96 font-lucky tracking-wide text-gray-400">
        Not all who wander are lost.
      </div>
    </div>
  );
}

const Orbiter = () => (
  <div className="object-fit rounded-full bg-[url('/svg/melancholy.svg')] bg-left transition-all duration-5000 ease-in hover:bg-center">
    <div
      className={cn(
        "",
        "flex items-center justify-center rounded-full",
        "bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))]",
        "from-sky-400/40 via-void/10 to-secondary-50",
        "group/card relative h-[8rem] w-[8rem]",
      )}
    >
      <Image
        src="/icon/logomark_v3.svg"
        alt="big-ticket-logomark"
        className="size-10 shadow-none grayscale"
        radius="full"
      />
    </div>
  </div>
);
