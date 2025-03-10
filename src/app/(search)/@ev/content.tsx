"use client";

import { EventViewer } from "@/app/(search)/@ev/viewer";
import { type api } from "@vx/api";
import { type Preloaded } from "convex/react";
import { CheckoutCtxProvider } from "./components/buttons/checkout/ctx";

export interface EVContentProps {
  preloadedEvents: Preloaded<typeof api.events.get.all>;
}
export const EVContent = (props: EVContentProps) => {
  return (
    <CheckoutCtxProvider>
      <EventViewer {...props} />
    </CheckoutCtxProvider>
  );
};
