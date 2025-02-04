"use client";

import type { SelectEvent } from "convex/events/d";
import { PreloadedEventsCtxProvider } from "@/app/ctx/event/preload";
import { Header } from "@/app/account/_components_/common";

export interface AccountContentProps {
  slug: string[] | undefined;
  preloaded: SelectEvent[];
}
export const Content = (props: AccountContentProps) => {
  return (
    <PreloadedEventsCtxProvider {...props}>
      <Header title="Account Settings"></Header>
    </PreloadedEventsCtxProvider>
  );
};
