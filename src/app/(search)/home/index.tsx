"use client";

import { useEvents } from "@/app/ctx/event/events";
import { WarpDrive } from "@/ui/loader/warp";
import { Image } from "@nextui-org/react";
import { motion } from "motion/react";
import { DesktopView } from "./desktop";

export const Home = () => {
  const { events } = useEvents();
  return <DesktopView xEvents={events} />;
};

export const Loader = () => (
  <WarpDrive className="relative -top-4 flex h-[96vh] w-full items-center justify-center py-32 md:py-48 lg:py-64">
    <div className="flex h-[18rem] w-full items-center justify-center bg-transparent px-10 md:h-[24rem]">
      <motion.div
        initial={{ scale: 2 }}
        animate={{ scale: 0, rotate: 720 }}
        transition={{ duration: 6 }}
        className="size-10 bg-transparent"
      >
        <Image
          alt="star"
          radius="none"
          className="size-10 bg-transparent"
          src="/svg/star_v1.svg"
        />
      </motion.div>
    </div>
  </WarpDrive>
);
