"use client";

import { useScreen } from "@/hooks/useScreen";
import { DesktopView } from "./desktop";
import { MobileView } from "./mobile";

export const Home = () => {
  const { isDesktop } = useScreen();
  return isDesktop ? <DesktopView /> : <MobileView />;
};
