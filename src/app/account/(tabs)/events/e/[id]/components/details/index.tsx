import { Tab, Tabs } from "@nextui-org/react";
import { type TabItem } from "../../editor";
import { SectionTitle } from "./components";
import { type ReactNode } from "react";
import { type ClassName } from "@/app/types";
import { cn } from "@/lib/utils";

interface EventDetailsProps {
  tabs: TabItem[];
}

export const EventDetails = ({ tabs }: EventDetailsProps) => {
  return (
    <div className="w-full border border-x-0 border-macl-gray bg-white text-xs md:rounded-lg md:border-x md:px-2">
      <SectionTitle title="Event Details" />
      <div className="h-full">
        <Tabs
          variant="underlined"
          color="primary"
          size="md"
          className="w-full"
          classNames={{
            panel: "w-full px-0 md:px-4 pb-8",
            cursor: "drop-shadow-sm bg-secondary h-[2.75px]",

            tab: "",
            tabList: "px-4 md:px-6 md:gap-4",
            tabContent:
              "text-primary font-semibold font-inter tracking-tighter",
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} title={tab.title}>
              {tab.content}
            </Tab>
          ))}
        </Tabs>
      </div>
      <div className="px-4 pb-6"></div>
    </div>
  );
};

interface NebulaProps {
  children: ReactNode;
  className?: ClassName;
}
export const Nebula = ({ children, className }: NebulaProps) => (
  <div
    className={cn("relative overflow-hidden rounded-lg bg-gray-200", className)}
  >
    {/* <!-- Base gradient background --> */}
    <div className="absolute inset-0 bg-gradient-to-br from-void via-void to-black opacity-90"></div>
    {/* <!-- Subtle green overlay --> */}
    <div className="bg-gradient-radial absolute inset-0 size-96 from-emerald-900/30 to-transparent opacity-20"></div>

    {/* <!-- Glowing orb - top right (yellow-green) --> */}
    <div className="absolute -top-16 right-36 size-[44rem] rounded-full bg-gradient-to-r from-lime-200 to-orange-100 opacity-5 blur-3xl"></div>

    {/* <!-- Glowing orb - left center (pink) --> */}
    <div className="absolute left-40 top-1/3 h-20 w-20 rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-300 opacity-10 blur-3xl"></div>

    {/* <!-- Glowing orb - bottom right (red-orange) --> */}
    <div className="absolute bottom-16 right-32 size-96 rounded-full bg-gradient-to-r from-red-200 to-orange-200 opacity-10 blur-3xl"></div>

    {/* <!-- Glowing orb - bottom left (small yellow) --> */}
    <div className="left-1/5 absolute bottom-1/4 h-8 w-8 rounded-full bg-gradient-to-r from-rose-300 to-sky-200 opacity-5 blur-lg"></div>

    {/* <!-- Content container --> */}
    <div className="relative z-10">{children}</div>
  </div>
);
