"use client";

import type { SelectEvent } from "convex/events/d";
import { Events } from "./events";
import { PreloadedUserEventsCtxProvider } from "@/app/ctx/event/user";
import { UserCtxProvider } from "@/app/ctx/user";

export interface AccountContentProps {
  events: SelectEvent[];
  id: string | undefined;
}
export const Content = (props: AccountContentProps) => {
  return (
    <PreloadedUserEventsCtxProvider {...props}>
      <UserCtxProvider>
        <Events />
      </UserCtxProvider>
    </PreloadedUserEventsCtxProvider>
  );
};
