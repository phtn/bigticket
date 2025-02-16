"use client";

import type { SelectEvent } from "convex/events/d";
import { PreloadedEventsCtxProvider } from "@/app/ctx/event/preload";
import { Tickets } from "./tickets";

export interface AccountContentProps {
  slug: string[] | undefined;
  preloaded: SelectEvent[];
}
export const Content = (props: AccountContentProps) => {
  return (
    <PreloadedEventsCtxProvider {...props}>
      <Tickets />
    </PreloadedEventsCtxProvider>
  );
};
