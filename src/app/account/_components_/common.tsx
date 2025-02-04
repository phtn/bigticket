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
    <Icon
      name="Squircle"
      className="absolute z-0 size-6 text-macl-gray md:size-8"
    />
    <p className="z-1 relative text-sm font-medium text-chalk drop-shadow-sm md:text-[16px]">
      {props.count}
    </p>
  </div>
);

interface EmptyListProps {
  title: string;
  count: number;
  message: string;
}
export const EmptyList = ({ count, message, title }: EmptyListProps) => {
  return (
    <div className="space-y-6">
      <Header title={title}>
        <Count count={count} />
      </Header>
      <div className="flex items-center justify-center">
        <div className="flex h-20 min-w-56 items-center justify-center">
          {message}
        </div>
      </div>
    </div>
  );
};
