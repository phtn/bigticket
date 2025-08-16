"use client";

import { AccountCtxProvider } from "@/app/ctx/accounts";
import { TicketViewerCtxProvider } from "./ctx";
import { Tickets } from "./tickets";

export const Content = () => {
  return (
    <AccountCtxProvider>
      <TicketViewerCtxProvider>
        <Tickets />
      </TicketViewerCtxProvider>
    </AccountCtxProvider>
  );
};
