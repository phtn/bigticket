"use client";

import { TicketViewerCtxProvider } from "./ctx";
import { Tickets } from "./tickets";

export const Content = () => {
  return (
    <TicketViewerCtxProvider>
      <Tickets />
    </TicketViewerCtxProvider>
  );
};
