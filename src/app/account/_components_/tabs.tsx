import { Tab, Tabs } from "@nextui-org/react";
import type { JSX } from "react";
import { EventsContent } from "./events";

export const TabComponent = () => (
  <Tabs
    size="sm"
    color="primary"
    variant="light"
    className="top-50 z-[100] flex h-full md:top-40 md:w-fit md:justify-center"
    classNames={{
      tabList:
        "w-fit justfify-start z-[200] space-x-10 lg:space-x-2 xl:space-x-4",
      tabContent:
        "text-coal/80 data-[selected=true]:text-white font-inter hover:text-macl-mint font-semibold tracking-tight",
      tab: "px-2 data-[hover-unselected]:opacity-100",
      panel: "md:pt-0 pt-12 md:px-6 h-full",
      base: "absolute overflow-x-scroll flex top-2 justify-center w-[calc(100vw)] sm:w-[calc(40vw)] md:left-[calc(48vw)] sm:left-[calc(38vw)] md:w-fit md:left-[calc(37vw)] z-[200] lg:left-[calc(31.25vw)] -top-4 xl:left-[calc(35.25vw)]",
    }}
  >
    {tabs.map((tab) => (
      <Tab key={tab.id} title={<TabTitle title={tab.title} />}>
        {tab.content}
      </Tab>
    ))}
  </Tabs>
);

const TabTitle = (props: { title: string }) => (
  <div className="flex items-center gap-1 lg:gap-1.5">
    <p className="text-xs font-semibold tracking-tighter md:text-sm">
      {props.title}
    </p>
  </div>
);

interface TabData {
  id: string;
  title: string;
  description: string;
  content: JSX.Element;
}
const tabs: TabData[] = [
  {
    id: "events",
    title: "Events",
    description: "Views, follows and other engagements.",
    content: <EventsContent />,
  },
  {
    id: "tickets",
    title: "Tickets",
    description: "View messages.",
    content: <div className="h-[420px] w-full bg-void/15" />,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Alerts and other notifications.",
    content: <div className="h-[420px] w-full bg-void/15" />,
  },
  {
    id: "settings",
    title: "Settings",
    description: "Edit account settings.",
    content: <div className="h-[420px] w-full bg-void/15" />,
  },
];
