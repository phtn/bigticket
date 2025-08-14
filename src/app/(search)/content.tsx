"use client";

import { GoogleOneTap } from "@/app/ctx/auth/one-tap";
import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopView } from "./rewards/desktop-view";
import { MobileView } from "./rewards/mobile-view";
import { memo, useCallback } from "react";
import { opts } from "@/utils/helpers";

export const Content = memo(() => {
  const { isMobile } = useIsMobile();

  const DeviceOptions = useCallback(() => {
    const options = opts(<MobileView />, <DesktopView />);
    return <>{options.get(isMobile !== undefined && isMobile)}</>;
  }, [isMobile]);

  const ViewOptions = useCallback(() => {
    const options = opts(<div>Loading...</div>, <DeviceOptions />);
    return <>{options.get(isMobile === undefined)}</>;
  }, [isMobile, DeviceOptions]);
  if (isMobile === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <ViewOptions />
      <GoogleOneTap />
    </>
  );
});

Content.displayName = "SearchContent";
