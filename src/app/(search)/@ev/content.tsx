"use client";

import { EventViewer } from "@/app/(search)/@ev/event-viewer";
import { EventsProvider } from "@/app/ctx/event/events";
import { CartCtxProvider } from "./components/buttons/cart/ctx";
export const EVContent = () => {
  return (
    <EventsProvider>
      <CartCtxProvider>
        <EventViewer />
      </CartCtxProvider>
    </EventsProvider>
  );
};
