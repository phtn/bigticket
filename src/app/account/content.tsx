"use client";

import { Icon } from "@/icons";
import { Card, CardHeader } from "@nextui-org/react";
import { use } from "react";
import { VxCtx } from "../ctx/convex/vx";
import { Header } from "./_components_/common";

export const Content = () => {
  const { vx } = use(VxCtx)!;
  return (
    <div className="min-h-[80vh] w-full justify-center rounded-none pb-10 md:rounded-lg md:px-6">
      <div className="">
        <Header title="Activity">
          <Icon name="Activity" className="size-4 text-macl-gray" />
        </Header>

        <div className="px-4 font-inter text-xs">
          <Card className="w-full rounded-lg p-1 font-medium tracking-tight md:max-w-md">
            <CardHeader>
              <div className="flex w-full items-center justify-between">
                <h2 className="text-[16px] font-medium tracking-tighter">
                  Engagements
                </h2>
                <h2 className="font-light">
                  Impressions:{" "}
                  <span className="font-semibold">{vx?.impressions ?? 0}</span>
                </h2>
              </div>
            </CardHeader>
            <div className="flex items-center justify-start border-t-4 p-3">
              <div className="w-full space-y-1">
                <p className="font-medium">Followers</p>
                <p className="text-lg font-bold">{vx?.follower_count ?? 0}</p>
              </div>
              <div className="w-full space-y-1">
                <p className="font-medium">Following</p>
                <p className="text-lg font-bold">{vx?.following_count ?? 0}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
