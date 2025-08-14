import { HList } from "@/components/ui/cardlist";
import { Iconx } from "@/icons";
import { type ReactNode } from "react";

export const MobileView = () => {
  return (
    <Container>
      <div className="absolute top-[400px] z-20 h-14 w-full rounded-b-[4rem] bg-gradient-to-br from-gray-400/60 via-zinc-700 to-zinc-950 opacity-10 blur-sm"></div>
      <HList>
        <div className="size-full rounded-b-[3rem] border-2 border-zinc-950 bg-pink-800"></div>
      </HList>
      <FullScreen>
        <div className="relative z-10 flex h-6 items-center px-10 text-base font-semibold tracking-tight text-zinc-300 md:text-xl">
          Hot Items
        </div>
        <div className="relative z-10 flex items-center space-x-6 overflow-scroll">
          <div className="flex w-fit items-center">
            <div className="flex items-center justify-center rounded-3xl">
              <Iconx name="squircle" solid className="size-36 text-zinc-700" />
            </div>
            <div className="flex items-center justify-center rounded-3xl">
              <Iconx name="squircle" solid className="size-36 text-zinc-700" />
            </div>
            <div className="flex items-center justify-center rounded-3xl">
              <Iconx name="squircle" solid className="size-36 text-zinc-900" />
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 flex h-20 w-full items-center justify-around px-2 text-zinc-300">
          <Iconx name="user-add" solid className="size-5 text-zinc-400" />
          <Iconx
            name="bookmark-add-02"
            solid
            className="size-4 text-zinc-400"
          />
          <Iconx name="gift-card" className="size-7 text-zinc-300" />
          <Iconx
            name="calendar-outline"
            solid
            className="size-4 text-zinc-400"
          />
          <Iconx name="user-settings" solid className="size-5 text-zinc-400" />
        </div>
      </FullScreen>
    </Container>
  );
};

interface ContainerProps {
  children: ReactNode;
}
const Container = ({ children }: ContainerProps) => (
  <div className="relative flex h-[156%] w-screen flex-col overflow-y-scroll bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-950">
    {children}
  </div>
);
interface FullScreenProps {
  children: ReactNode;
}
const FullScreen = ({ children }: FullScreenProps) => {
  return (
    <div className="relative flex h-[100lvh] w-full flex-col bg-gradient-to-br from-zinc-900 via-zinc-950 to-black py-6">
      {children}
    </div>
  );
};
