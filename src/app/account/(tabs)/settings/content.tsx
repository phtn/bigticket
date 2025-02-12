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
      <div className="min-h-[36rem] bg-chalk p-6">
        <Header title="Account Settings"></Header>

        <div className="p-4 text-xs">
          <div className="w-fit space-y-2 rounded-md bg-gray-200 p-2">
            <p>&rarr; In-progress</p>
            <pre className="">id: 010c</pre>
          </div>
        </div>
      </div>
    </PreloadedEventsCtxProvider>
  );
};
