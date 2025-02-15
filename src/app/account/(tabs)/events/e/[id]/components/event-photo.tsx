import { Icon } from "@/icons";
import { Button } from "@nextui-org/react";

export const EventPhoto = () => (
  <div className="relative flex items-center justify-center border-primary/40 md:border-b lg:border-r xl:border-b-0">
    <div className="absolute">
      <Icon name="ImageIcon" className="size-24 opacity-20" />
    </div>
    <div className="absolute top-0 flex h-10 w-full items-center justify-between px-4 text-xs">
      <p>Event Photo</p>
    </div>
    <div className="absolute bottom-0 flex h-16 w-full items-center justify-between px-4">
      <p></p>
      <Button
        size="sm"
        color="primary"
        variant="solid"
        className="hover:bg-white"
      >
        Upload image
        <Icon name="Upload" className="size-4" />
      </Button>
    </div>
  </div>
);
