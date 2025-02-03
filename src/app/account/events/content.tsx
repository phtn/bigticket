"use client";

import type { SelectEvent } from "convex/events/d";
import { PreloadedEventsCtxProvider } from "@/app/ctx/event/preload";
import { Events } from "./events";
import { log } from "@/utils/logger";

export interface AccountContentProps {
  slug: string[] | undefined;
  preloaded: SelectEvent[];
}
export const Content = (props: AccountContentProps) => {
  log("content", props.preloaded);
  return (
    <PreloadedEventsCtxProvider {...props}>
      <Events />
    </PreloadedEventsCtxProvider>
  );
};
