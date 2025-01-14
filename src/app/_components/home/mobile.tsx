import { Avatar } from "@nextui-org/react";
import { MobileCards } from "./components";

export const MobileView = () => {
  return (
    <div className="min-h-screen space-y-2 bg-black p-2 text-white">
      <header className="flex h-12 items-center justify-between px-2">
        <h1 className="font-cherry from-macl-indigo to-macl-gray h-8 bg-gradient-to-r bg-clip-text text-xl font-semibold leading-none text-transparent">
          Nightlife
        </h1>
        <Avatar src="/icon/icon.svg" size="sm" />
      </header>

      <div className="grid gap-2">
        <MobileCards />
      </div>
    </div>
  );
};
