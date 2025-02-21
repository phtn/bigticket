"use client";

import type { SelectEvent } from "convex/events/d";
import { Events } from "./events";
import { PreloadedUserEventsCtxProvider } from "@/app/ctx/event/user";

export interface AccountContentProps {
  events: SelectEvent[];
  id: string | undefined;
}
export const Content = (props: AccountContentProps) => {
  return (
    <PreloadedUserEventsCtxProvider {...props}>
      <Events />
    </PreloadedUserEventsCtxProvider>
  );
};
