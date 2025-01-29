import { Icon } from "@/icons";
import { Button } from "@nextui-org/react";

interface TopbarProps {
  event_name: string | undefined;
  id: string | undefined;
}
export const Topbar = ({ event_name, id }: TopbarProps) => (
  <div className="flex h-16 w-full items-center justify-between px-4">
    <p className="space-x-6">
      <span className="font-medium tracking-tighter opacity-80">Event:</span>
      <span className="font-extrabold tracking-tight">{event_name}</span>
      <span className="font-mono text-xs">{id}</span>
    </p>
    <Button size="sm" variant="solid" color="primary">
      Publish Event
      <Icon name="Launch" className="size-4" />
    </Button>
  </div>
);
