import { SidebarCtx } from "@/app/ctx/sidebar";
import { Icon } from "@/icons";
import { Button } from "@nextui-org/react";
import { use } from "react";

interface TopbarProps {
  event_name: string | undefined;
}
export const Topbar = ({ event_name }: TopbarProps) => {
  const { toggle } = use(SidebarCtx)!;
  return (
    <div className="flex h-20 w-full items-center justify-between px-2 md:px-4">
      <div className="whitespace-nowrap">
        <h1 className="max-w-[30ch] text-xl font-bold tracking-tighter md:text-2xl md:font-extrabold">
          {event_name}
        </h1>
      </div>
      <section className="flex gap-2 md:gap-4">
        <Button
          onPress={toggle}
          size="sm"
          isIconOnly
          className="bg-transparent"
        >
          <Icon
            name="Settings2"
            className="size-6 stroke-[0.5px] text-macl-gray"
          />
        </Button>
        <Button size="sm" isIconOnly className="bg-transparent">
          <Icon name="Tv" className="size-6 stroke-[0.5px] text-macl-gray" />
        </Button>
        <Button size="sm" variant="solid" color="primary">
          Publish <span className="hidden md:flex">Event</span>
          <Icon name="Launch" className="hidden size-4 md:flex" />
        </Button>
      </section>
    </div>
  );
};
