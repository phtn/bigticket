"use client";

import type { SelectEvent } from "convex/events/d";
import { PreloadedEventsCtxProvider } from "@/app/ctx/event/preload";
import { Header } from "@/app/account/_components_/common";
import { Icon } from "@/icons";
import { Card, CardHeader } from "@nextui-org/react";
import { use, useMemo } from "react";
import { VxCtx } from "@/app/ctx/convex/vx";
import { type SelectUser } from "convex/users/d";
import { HyperList } from "@/ui/list";
import { ButtonIcon } from "@/ui/button";

export interface AccountContentProps {
  slug: string[] | undefined;
  preloaded: SelectEvent[];
}
export const Content = (props: AccountContentProps) => {
  const { vx } = use(VxCtx)!;

  const data: FieldItemProps[] = useMemo(
    () => [
      {
        id: "nickname",
        label: "Nickname",
        value: vx?.nickname,
      },
    ],
    [vx],
  );

  return (
    <PreloadedEventsCtxProvider {...props}>
      <Header title="Account Settings">
        <Icon name="Settings" className="size-4" />
      </Header>

      <div className="px-4 font-inter text-xs">
        <Card className="w-full rounded-lg p-1 font-medium tracking-tight md:max-w-xl">
          <CardHeader>
            <div className="flex w-full items-center justify-between">
              <h2 className="text-[16px] font-medium tracking-tighter">
                Profile
              </h2>
            </div>
          </CardHeader>
          <HyperList
            container="flex items-center justify-start border-t-4 p-3"
            data={data}
            component={FieldItem}
            itemStyle="w-full"
            keyId="id"
          />
        </Card>
      </div>
    </PreloadedEventsCtxProvider>
  );
};

interface FieldItemProps {
  id: keyof SelectUser;
  label: string;
  value?: string | number;
}
const FieldItem = (item: FieldItemProps) => (
  <div className="flex w-full items-center justify-between">
    <div className="space-y-1">
      <p className="font-medium opacity-60">{item.label}</p>
      <p className="text-[16px] font-medium">{item.value}</p>
    </div>
    <ButtonIcon icon="Pen" />
  </div>
);
