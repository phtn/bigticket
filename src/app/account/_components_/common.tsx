import { Icon } from "@/icons";
import { type ReactNode } from "react";

interface HeaderProps {
  children?: ReactNode;
  title: string;
}
export const Header = ({ title, children }: HeaderProps) => (
  <section className="flex h-20 items-center gap-2 font-inter">
    <h1 className="ps-4 font-medium tracking-tighter md:text-xl">{title}</h1>
    {children}
  </section>
);

export const Count = (props: { count: number | undefined }) => (
  <div className="relative flex size-8 items-center justify-center">
    <Icon name="Squircle" className="absolute z-0 size-6 text-void md:size-8" />
    <p className="z-1 relative text-sm font-semibold text-chalk md:text-[16px]">
      {props.count}
    </p>
  </div>
);
