import { Icon, type IconName } from "@/icons";
import { Tab, Tabs } from "@nextui-org/react";
import type { JSX } from "react";

export const TabComponent = () => (
  <Tabs
    size="md"
    color="secondary"
    variant="light"
    className="z-[200] flex h-full justify-center md:w-fit"
    classNames={{
      tabList:
        "w-fit justfify-start z-[200] md:space-x-0 lg:space-x-2 xl:space-x-4",
      tabContent:
        "text-coal/80 data-[selected=true]:text-white font-inter hover:text-macl-blue tracking-tight",
      tab: "px-2 data-[hover-unselected]:opacity-100",
      panel: "mt-10 px-6 h-full",
      base: " absolute overflow-x-scroll w-[calc(30vw)] sm:w-[calc(40vw)] left-[calc(48vw)] sm:left-[calc(38vw)] md:w-fit md:left-[calc(37vw)] z-[200] lg:left-[calc(31.25vw)] -top-4 xl:left-[calc(35.25vw)]",
    }}
  >
    {tabs.map((tab) => (
      <Tab key={tab.id} title={<TabTitle title={tab.title} icon={tab.icon} />}>
        <tab.content />
      </Tab>
    ))}
  </Tabs>
);

const TabTitle = (props: { title: string; icon: IconName }) => (
  <div className="flex items-center gap-1 lg:gap-1.5">
    <Icon name={props.icon} className="size-4" />
    <p className="text-sm font-medium tracking-tight">{props.title}</p>
  </div>
);

interface TabData {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  content: () => JSX.Element;
}
const tabs: TabData[] = [
  {
    id: "activity",
    title: "Activity",
    description: "Views, follows and other engagements.",
    icon: "Stats",
    content: () => <div className="h-[420px] w-full bg-void/15" />,
  },
  {
    id: "chats",
    title: "Chats",
    description: "View messages.",
    icon: "Chats",
    content: () => <div className="h-[420px] w-full bg-void/15" />,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Alerts and other notifications.",
    icon: "Bell",
    content: () => <div className="h-[420px] w-full bg-void/15" />,
  },
  {
    id: "settings",
    title: "Settings",
    description: "Edit account settings.",
    icon: "Cog",
    content: () => <div className="h-[420px] w-full bg-void/15" />,
  },
];

interface AccountDetailProps {
  name: string | undefined;
  verified: boolean | undefined;
}
export const AccountSummary = (props: AccountDetailProps) => {
  return (
    <div className="h-2 w-full border border-pink-300 p-6">
      <div className="h-full w-full p-2">
        <div className="flex items-center space-x-4 py-2">
          <p className="text-xl font-bold">{props.name}</p>
        </div>
      </div>
    </div>
  );
};
