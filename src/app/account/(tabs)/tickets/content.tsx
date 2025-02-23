"use client";

import { UserCtxProvider } from "@/app/ctx/user/ctx";
import { TicketViewerCtxProvider } from "./ctx";
import { Tickets } from "./tickets";

export const Content = () => {
  return (
    <UserCtxProvider>
      <TicketViewerCtxProvider>
        <Tickets />
      </TicketViewerCtxProvider>
    </UserCtxProvider>
  );
};
