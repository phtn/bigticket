"use client";

import { GoogleOneTap } from "@/app/ctx/auth/g-tap";
import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopView } from "./rewards/desktop-view";
import { MobileView } from "./rewards/mobile-view";
import { Home } from "./home";
import { memo, useCallback } from "react";
import { opts } from "@/utils/helpers";
import { EventsProvider } from "@/app/ctx/event/events";

export const Content = memo(() => {
  const { isMobile } = useIsMobile();

  const DeviceOptions = useCallback(() => {
    const options = opts(<MobileView />, <DesktopView />);
    return <>{options.get(isMobile !== undefined && isMobile)}</>;
  }, [isMobile]);

  const ViewOptions = useCallback(() => {
    const options = opts(<Home />, <DeviceOptions />);
    return <>{options.get(isMobile === undefined)}</>;
  }, [isMobile, DeviceOptions]);

  if (isMobile === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <EventsProvider>
      <ViewOptions />
      <GoogleOneTap />
    </EventsProvider>
  );
});

Content.displayName = "SearchContent";
