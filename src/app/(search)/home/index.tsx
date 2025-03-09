"use client";

import { useScreen } from "@/hooks/useScreen";
import { WarpDrive } from "@/ui/loader/warp";
import { opts } from "@/utils/helpers";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { DesktopView } from "./desktop";
import { MobileView } from "./mobile";
import { Image } from "@nextui-org/react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { type api } from "@vx/api";
import { useEvents } from "./useEvents";

export interface HomeProps {
  preloadedEvents: Preloaded<typeof api.events.get.all>;
}
export const Home = (props: HomeProps) => {
  const [ready, setReady] = useState<boolean>(false);
  const { isDesktop } = useScreen();
  const events = usePreloadedQuery(props.preloadedEvents);
  const { xEvents, loading } = useEvents(events);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const ViewOptions = useCallback(() => {
    const options = opts(
      <DesktopView xEvents={xEvents} />,
      <MobileView xEvents={xEvents} />,
    );
    return <>{options.get(isDesktop)}</>;
  }, [isDesktop, xEvents]);
  return ready && !loading ? <ViewOptions /> : <Loader />;
};

const Loader = () => (
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
