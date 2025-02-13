import { BottomVaul } from "@/ui/vaul";
import { type SelectEvent } from "convex/events/d";
import { type MouseEvent, type ReactNode, use, useCallback } from "react";
import { OptionCtx } from "./ctx";

interface OptionButtonProps {
  name: keyof SelectEvent;
  label: string;
  placeholder?: string;
  value: string | number;
}
export const OptionButton = ({ name, label, value }: OptionButtonProps) => {
  const { toggle } = use(OptionCtx)!;
  const handleClick = useCallback(
    (e: MouseEvent) => {
      toggle();
      e.preventDefault();
    },
    [toggle],
  );
  return (
    <button
      id={name}
      name={name}
      onClick={handleClick}
      className="h-14 w-full space-y-2 rounded-xl border border-macl-gray/60 py-2 ps-2.5 text-left font-inter tracking-tight hover:bg-macl-gray/5"
    >
      <p className="text-xs font-medium leading-none text-macl-gray">{label}</p>
      <p className="font-semibold leading-none">{value}</p>
    </button>
  );
};

export const OptionActionSheet = ({ children }: { children: ReactNode }) => {
  const { open, toggle } = use(OptionCtx)!;
  return (
    <BottomVaul dismissible open={open} onOpenChange={toggle}>
      <div className="h-[20rem] w-screen p-6 md:w-[30rem]">{children}</div>
    </BottomVaul>
  );
};
