import { Tab, Tabs } from "@nextui-org/react";
import { type TabItem } from "../../editor";
import { SectionTitle } from "./components";

interface EventDetailsProps {
  tabs: TabItem[];
}

export const EventDetails = ({ tabs }: EventDetailsProps) => {
  return (
    <div className="w-full border border-x-0 border-macl-gray bg-white text-xs md:rounded-lg md:border-x md:px-2">
      <SectionTitle title="Event Details" />
      <div className="h-full">
        <Tabs
          variant="solid"
          color="primary"
          size="sm"
          className="w-full"
          classNames={{
            panel: "w-full px-0 md:px-4 pb-8",
            tabList: "px-4",
            tabContent: "font-semibold font-inter tracking-tighter",
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} title={tab.title}>
              {tab.content}
            </Tab>
          ))}
        </Tabs>
      </div>
      <div className="px-4 pb-6">
        <div className="h-96 bg-gray-300"></div>
      </div>
    </div>
  );
};
