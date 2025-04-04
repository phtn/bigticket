"use client";

import { cn } from "@/lib/utils";
import { Tab, Tabs } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useMemo,
  useState,
  type Key,
  type ReactNode,
} from "react";

export const TabComponent = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const selectedKey = pathname.split("/")[2];
  const [selected, setSelected] = useState<string | undefined>(selectedKey);
  const router = useRouter();
  const sub = pathname.split("/")[3];

  const tabs: TabData[] = useMemo(
    () => [
      {
        id: "/",
        title: "Overview",
        description: "Account overview.",
      },
      {
        id: "tickets",
        title: "Tickets",
        description: "View messages.",
      },
      {
        id: "events",
        title: "Events",
        description: "Views, follows and other engagements.",
      },
      {
        id: "settings",
        title: "Settings",
        description: "Edit account settings.",
      },
    ],
    [],
  );

  const handleSelect = useCallback(
    (k: Key) => {
      router.push(`/account/${k ?? ""}`);
      setSelected(k as string);
    },
    [router, setSelected],
  );

  return (
    <div className={cn("size-full")}>
      <Tabs
        size="sm"
        color="primary"
        variant="light"
        className={cn(
          "relative top-0.5 z-50 flex h-10 md:absolute md:top-[9.5rem] md:h-12 md:w-fit md:justify-center",
          { hidden: sub?.length === 1 },
        )}
        classNames={{
          tabList:
            "w-fit gap-1 lg:gap-1.5 justfify-start space-x-8 md:bg-gray-300 md:p-2 sm:space-x-6 md:space-x-5 transition-all duration-300 lg:space-x-8 xl:space-x-12",
          tabContent:
            "text-coal/80 data-[selected=true]:text-white text-xs font-semibold tracking-tighter md:text-sm tracking-tight",
          tab: "px-2 data-[hover-unselected]:opacity-100 hover:bg-gray-300/60",
          panel: "md:pt-0 px-0 pt-12 md:px-6",
          base: "absolute overflow-x-scroll transition-all duration-300 flex -top-20 justify-center w-[calc(100vw)] sm:w-full md:left-80 sm:left-0 z-[200] -top-4 xl:left-[calc(30vw)] lg:w-[calc(36vw)] lg:left-80 lg:w-[calc(50vw)]",
          wrapper: "w-10 flex items-center ",
        }}
        items={tabs}
        onSelectionChange={handleSelect}
        selectedKey={selected ?? selectedKey}
      >
        {tabs.map((tab) => (
          <Tab
            value={tab.id}
            name={tab.id}
            key={tab.id}
            title={<TabTitle title={tab.title} />}
          />
        ))}
      </Tabs>

      <div className="min-h-[calc(100vh-249px)]">{children}</div>
    </div>
  );
};

const TabTitle = (props: { title: string }) => (
  <div className="flex items-center gap-1 lg:gap-1.5">
    <p className="">{props.title}</p>
  </div>
);

interface TabData {
  id: string;
  title: string;
  description: string;
}
