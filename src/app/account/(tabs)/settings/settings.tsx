"use client";

import { Header } from "@/app/account/_components_/common";
import { Accordion, AccordionItem, Card, CardHeader } from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type SelectUser } from "convex/users/d";
import { HyperList } from "@/ui/list";
import { HyperLink } from "@/ui/button/button";
import { useQuery } from "convex/react";
import { api } from "@vx/api";
import { useConvexUtils } from "@/app/ctx/convex/useConvexUtils";
import { getUserID } from "@/app/actions";
import { Err } from "@/utils/helpers";
import { BtnIcon } from "@/ui/button/button-icon";
import { Iconx } from "@/icons/icon";

export const UserSettings = () => {
  const { q } = useConvexUtils();
  const [userId, setUserId] = useState<string>();
  const x = useQuery(api.users.get.byId, { id: q(userId) });
  const [xUser, setXUser] = useState<SelectUser | null>(null);

  const setId = useCallback(async () => {
    setUserId((await getUserID()) ?? undefined);
  }, []);

  useEffect(() => {
    setId().catch(Err);
  }, [setId]);

  useEffect(() => {
    if (x) {
      setXUser(x);
    }
  }, [x]);

  const data: FieldItemProps[] = useMemo(
    () => [
      {
        id: "nickname",
        label: "Nickname",
        value: xUser?.nickname,
      },
    ],
    [xUser],
  );

  return (
    <div className="rounded- min-h-[80vh] w-full justify-center pb-10 md:rounded-lg md:px-6">
      <div className="">
        <Header title="Settings">
          <Iconx name="settings-01" className="size-4 text-macl-gray" />
        </Header>

        <div className="space-y-6 px-4 font-inter text-xs">
          <Card className="w-full rounded-lg p-1 font-medium tracking-tight md:max-w-sm">
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

          <div className="space-y-4 rounded-xl bg-gray-300 px-4 py-6 md:max-w-sm">
            <div className="px-2">
              <HyperLink
                href={"/signout"}
                rounded
                dark
                lg
                fullWidth
                label="Sign out"
              />
            </div>
            <Accordion variant="splitted">
              <AccordionItem
                indicator={<Iconx name="plus-sign" className="size-4" />}
                title="Additional Settings"
                classNames={{
                  base: "bg-primary/40 rounded-lg h-fit",
                  title: "text-xs tracking-tighter text-primary font-semibold",
                }}
              >
                <div className="space-y-4 border-t py-4">
                  <HyperLink
                    href={"/signout"}
                    rounded
                    dark
                    lg
                    fullWidth
                    label="Deactivate account"
                  />
                  <HyperLink
                    href={"/signout"}
                    rounded
                    dark
                    destructive
                    fullWidth
                    label="Delete account"
                  />
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
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
    <BtnIcon icon="pencil-edit-01" bg="text-gray-200" />
  </div>
);
