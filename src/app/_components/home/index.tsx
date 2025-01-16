"use client";

import { useScreen } from "@/hooks/useScreen";
import { DesktopView } from "./desktop";
import { MobileView } from "./mobile";
import { useCallback, useEffect, useState } from "react";
import { opts } from "@/utils/helpers";
import { WarpDrive } from "@/ui/loader/warp";
import { motion } from "motion/react";

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
  <WarpDrive
    gridColor="#ccc"
    className="relative -top-4 flex h-full w-full items-center justify-center"
  >
    <div className="flex h-[28rem] w-full items-center justify-center">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 2 }}
        transition={{ duration: 5 }}
        className="h-16 w-24 bg-white/5 backdrop-blur-sm"
      ></motion.div>
    </div>
  </WarpDrive>
);
