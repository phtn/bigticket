"use client";

import { useScreen } from "@/hooks/useScreen";
import { WarpDrive } from "@/ui/loader/warp";
import { opts } from "@/utils/helpers";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { DesktopView } from "./desktop";
import { MobileView } from "./mobile";

export const Home = () => {
  const [ready, setReady] = useState<boolean>(false);
  const { isDesktop } = useScreen();

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const ViewOptions = useCallback(() => {
    const options = opts(<DesktopView />, <MobileView />);
    return <>{options.get(isDesktop)}</>;
  }, [isDesktop]);
  return ready ? <ViewOptions /> : <Loader />;
};

const Loader = () => (
  <WarpDrive
    gridColor="#111"
    className="relative -top-4 flex h-full w-full items-center justify-center p-44"
  >
    <div className="flex h-[24rem] w-full items-center justify-center px-10">
      <motion.div
        initial={{ scale: 3 }}
        animate={{ scale: 0 }}
        transition={{ duration: 0.4 }}
        className="h-16 w-24 bg-white/5 backdrop-blur-sm"
      ></motion.div>
    </div>
  </WarpDrive>
);
