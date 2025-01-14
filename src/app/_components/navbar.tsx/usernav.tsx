import { Icon } from "@/icons";
import { TextLoader } from "@/ui/loader/text";
import { Button, Input } from "@nextui-org/react";

export const UserNav = () => (
  <div className="flex w-full items-center justify-between bg-white p-3 font-inter">
    <div className="z-1 relative flex h-full w-[420px] items-center">
      <Searchbar />
    </div>
    <div className="flex items-center px-1">
      <Button
        variant="solid"
        radius="full"
        className="w-fit bg-white font-inter text-[16px] font-medium tracking-tighter"
      >
        <TextLoader color="text-primary-500" />
      </Button>
    </div>
  </div>
);

const Searchbar = () => {
  return (
    <div className="relative flex w-full items-center">
      <Input
        placeholder="Search events"
        size="lg"
        variant="flat"
        radius="full"
        className="rounded-full bg-ghost"
        classNames={{
          input:
            "placeholder:text-primary/60 font-inter placeholder:text-sm tracking-tight placeholder:tracking-tight placeholder:font-light placeholder:ps-0.5 ps-2 font-inter w-full",
          inputWrapper: "border-macl-pink border-0 shadow-none w-full",
          innerWrapper: "border-0",
        }}
        startContent={
          <Icon
            name="Search"
            className="pointer-events-none size-4 stroke-gray-500 stroke-1 text-gray-500"
          />
        }
      />
    </div>
  );
};
