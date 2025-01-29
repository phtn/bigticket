import { Icon } from "@/icons";
import { Button } from "@nextui-org/react";

interface TopbarProps {
  event_name: string | undefined;
}
export const Topbar = ({ event_name }: TopbarProps) => (
  <div className="flex h-16 w-full items-center justify-between px-4">
    <div className="space-x-6 whitespace-nowrap">
      <h1 className="text-xl font-extrabold tracking-tight">{event_name}</h1>
    </div>
    <Button size="sm" variant="solid" color="primary">
      Publish Event
      <Icon name="Launch" className="size-4" />
    </Button>
  </div>
);
