import { SideVaul } from "@/ui/vaul";
import { type SelectEvent } from "convex/events/d";
import { type MouseEvent, type ReactNode, useCallback } from "react";

interface OptionButtonProps {
  name: keyof SelectEvent;
  label: string;
  placeholder?: string;
  value: string | number;
}
export const OptionButton = ({ name, label, value }: OptionButtonProps) => {
  const handleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    console.log("option-button: clicked");
  }, []);
  return (
    <button
      id={name}
      name={name}
      onClick={handleClick}
      className="h-14 w-full space-y-1.5 rounded-xl border border-macl-gray/60 py-2 ps-2.5 text-left font-inter tracking-tight hover:bg-macl-gray/5"
    >
      <p className="text-xs font-medium leading-none text-macl-gray">{label}</p>
      <p className="text-lg font-semibold leading-none">{value}</p>
    </button>
  );
};

export const OptionActionSheet = ({ children }: { children: ReactNode }) => {
  return (
    <SideVaul direction="bottom">
      <div className="h-40 bg-tan">{children}</div>
    </SideVaul>
  );
};
