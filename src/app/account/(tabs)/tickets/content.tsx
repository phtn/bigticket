"use client";

import type { SelectEvent } from "convex/events/d";
import { PreloadedEventsCtxProvider } from "@/app/ctx/event/preload";
import { Count, Header } from "@/app/account/_components_/common";

export interface AccountContentProps {
  slug: string[] | undefined;
  preloaded: SelectEvent[];
}
export const Content = (props: AccountContentProps) => {
  return (
    <PreloadedEventsCtxProvider {...props}>
      <Header title="My Tickets">
        <Count count={props.preloaded.length} />
      </Header>
    </PreloadedEventsCtxProvider>
  );
};
