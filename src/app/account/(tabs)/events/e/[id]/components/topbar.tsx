import { Icon } from "@/icons";
import { Button } from "@nextui-org/react";
import Link from "next/link";

interface TopbarProps {
  event_name: string | undefined;
}
export const Topbar = ({ event_name }: TopbarProps) => {
  return (
    <div className="flex h-20 w-full items-center justify-between px-3 md:px-4">
      <div className="space-y-1 whitespace-nowrap md:ps-4">
        <Link href="/account/events" className="group">
          <div className="flex items-center gap-2 text-tiny">
            <span>&larr;</span>
            <span className="underline-offset-2 group-hover:underline">
              Events
            </span>
          </div>
        </Link>
        <h1 className="max-w-[30ch] text-xl font-bold tracking-tighter md:text-2xl md:font-extrabold">
          {event_name}
        </h1>
      </div>
      <section className="flex gap-2 md:gap-4">
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
