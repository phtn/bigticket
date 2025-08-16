"use client";

import type { SelectEvent } from "convex/events/d";
import { Events } from "./events";
import { PreloadedUserEventsCtxProvider } from "@/app/ctx/event/user";
import { AccountCtxProvider } from "@/app/ctx/accounts";

export interface AccountContentProps {
  events: SelectEvent[];
  id: string | undefined;
}
export const Content = (props: AccountContentProps) => {
  return (
    <PreloadedUserEventsCtxProvider {...props}>
      <AccountCtxProvider>
        <Events />
      </AccountCtxProvider>
    </PreloadedUserEventsCtxProvider>
  );
};
