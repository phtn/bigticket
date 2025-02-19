import { Tab, Tabs } from "@nextui-org/react";
import { SectionTitle } from "./components";
import { type TabItem } from "../../content";

interface EventDetailsProps {
  tabs: TabItem[];
}

export const EventDetails = ({ tabs }: EventDetailsProps) => {
  return (
    <div className="w-full text-xs md:p-4">
      <SectionTitle title="Event Details" icon="PencilEdit" />

      <div className="h-full py-6">
        <Tabs
          variant="solid"
          color="primary"
          className="w-full"
          classNames={{
            panel: "w-full px-0 md:px-4",
            tabList: "px-4 md:px-2",
            tabContent: "font-medium tracking-tighter",
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} title={tab.title}>
              {tab.content}
            </Tab>
          ))}
        </Tabs>
      </div>
      <div className="h-96 bg-gray-300 py-8"></div>
    </div>
  );
};
