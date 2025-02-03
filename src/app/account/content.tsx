"use client";

import type { SelectEvent } from "convex/events/d";
import { PreloadedEventsCtxProvider } from "../ctx/event/preload";

export interface AccountContentProps {
  slug: string[] | undefined;
  preloaded: SelectEvent[];
}
export const Content = (props: AccountContentProps) => {
  return (
    <PreloadedEventsCtxProvider {...props}>
      <div className="p-6">Overview</div>
    </PreloadedEventsCtxProvider>
  );
};
