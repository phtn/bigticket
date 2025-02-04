"use client";

import { useScreen } from "@/hooks/useScreen";
import { WarpDrive } from "@/ui/loader/warp";
import { opts } from "@/utils/helpers";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { DesktopView } from "./desktop";
import { MobileView } from "./mobile";
import { Image } from "@nextui-org/react";

export const Home = () => {
  const [ready, setReady] = useState<boolean>(false);
  const { isDesktop } = useScreen();

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const ViewOptions = useCallback(() => {
    const options = opts(<DesktopView />, <MobileView />);
    return <>{options.get(isDesktop)}</>;
  }, [isDesktop]);
  return ready ? <ViewOptions /> : <Loader />;
};

const Loader = () => (
  <WarpDrive className="relative -top-4 flex h-[96vh] w-full items-center justify-center md:py-48 lg:py-64">
    <div className="flex h-[24rem] w-full items-center justify-center px-10">
      <motion.div
        initial={{ scale: 2 }}
        animate={{ scale: 0, rotate: 720 }}
        transition={{ duration: 6 }}
        className="size-10 bg-transparent"
      >
        <Image
          alt="star"
          radius="none"
          className="size-10"
          src="/svg/star_v1.svg"
        />
      </motion.div>
    </div>
  </WarpDrive>
);
