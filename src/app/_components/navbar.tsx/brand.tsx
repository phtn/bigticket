import { Icon } from "@/icons";
import { Button } from "@nextui-org/react";

export const Brand = () => {
  return (
    <div className="flex h-full w-[370px] items-center justify-between bg-white p-3">
      <div className="flex h-12 items-center">
        <div className="relative left-4 z-0 flex size-6 items-center justify-center">
          <Icon
            name="TicketFill"
            className="absolute -bottom-[2px] -left-1 size-7 -rotate-[155deg] stroke-white text-macl-mint opacity-80"
          />
          <Icon
            name="TicketFill"
            className="absolute bottom-[2px] left-[3px] size-7 -rotate-[110deg] stroke-chalk text-peach"
          />
        </div>
        <BrandName />
      </div>
      <Button
        size="sm"
        isIconOnly
        radius="full"
        color="secondary"
        className="group bg-ghost text-gray-400 hover:bg-peach"
      >
        <Icon
          name="Fire"
          className="size-4 stroke-primary-700 stroke-1 text-primary-700 group-hover:stroke-chalk group-hover:text-chalk"
        />
      </Button>
    </div>
  );
};

const BrandName = () => (
  <div className="z-1 relative h-12 px-2">
    <h2 className="absolute left-[6.5px] top-[1px]">
      <span className="font-lucky text-[32px] font-bold text-white">BIG</span>
    </h2>
    <h2 className="absolute top-0 space-x-1">
      <span className="font-lucky text-3xl font-bold text-primary-700">
        BIG
      </span>
      <span className="font-cherry text-3xl font-light text-orange-400 drop-shadow-sm">
        ticket
      </span>
    </h2>
  </div>
);
