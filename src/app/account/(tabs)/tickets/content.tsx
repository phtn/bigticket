"use client";

import type { SelectEvent } from "convex/events/d";
import { PreloadedEventsCtxProvider } from "@/app/ctx/event/preload";
import { Tickets } from "./tickets";
import { TicketViewerCtxProvider } from "./ctx";

export interface AccountContentProps {
  slug: string[] | undefined;
  preloaded: SelectEvent[];
}
export const Content = (props: AccountContentProps) => {
  return (
    <PreloadedEventsCtxProvider {...props}>
      <TicketViewerCtxProvider>
        <Tickets />
      </TicketViewerCtxProvider>
    </PreloadedEventsCtxProvider>
  );
};
