import { Tab, Tabs } from "@nextui-org/react";
import type { JSX } from "react";
import { EventsContent } from "./events";

export const TabComponent = () => (
  <Tabs
    size="sm"
    color="primary"
    variant="light"
    className="top-50 z-50 flex h-full md:top-40 md:w-fit md:justify-center"
    classNames={{
      tabList:
        "w-fit justfify-start space-x-8 sm:space-x-6 md:space-x-5 transition-all duration-300 lg:space-x-8 xl:space-x-12",
      tabContent:
        "text-coal/80 data-[selected=true]:text-white font-inter hover:text-macl-mint font-semibold tracking-tight",
      tab: "px-2 data-[hover-unselected]:opacity-100",
      panel: "md:pt-0 px-0 pt-12 md:px-6 h-full",
      base: "absolute overflow-x-scroll h-fit transition-all duration-300 flex top-2 justify-center w-[calc(100vw)] sm:w-full md:left-80 sm:left-0 z-[200] -top-4 xl:left-[calc(30vw)] lg:w-[calc(36vw)] lg:left-80 lg:w-[calc(50vw)]",
      wrapper:
        "bg-macl-indigo border border-macl-indigo w-10 flex items-center ",
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
