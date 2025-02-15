import { BottomVaul } from "@/ui/vaul";
import { type MouseEvent, type ReactNode, use, useCallback } from "react";
import { OptionCtx, type OptionKey } from "./ctx";

export interface OptionButtonProps {
  name: OptionKey;
  label: string;
  placeholder?: string;
  value: string | number | boolean | undefined;
}
export const OptionButton = ({ name, label, value }: OptionButtonProps) => {
  const { toggle, setSelectedOption } = use(OptionCtx)!;
  const handleClick = useCallback(
    (name: OptionKey | null) => (e: MouseEvent) => {
      e.preventDefault();
      setSelectedOption(name);
      toggle();
    },
    [toggle, setSelectedOption],
  );
  return (
    <button
      id={name}
      name={name}
      onClick={handleClick(name)}
      className="h-14 w-full space-y-2 rounded-xl border border-macl-gray/60 py-2 ps-2.5 text-left font-inter tracking-tight hover:bg-macl-gray/5"
    >
      <p className="text-xs font-medium leading-none text-macl-gray">{label}</p>
      <p className="overflow-hidden whitespace-nowrap font-semibold leading-none">
        {value}
      </p>
    </button>
  );
};

export const OptionActionSheet = ({ children }: { children: ReactNode }) => {
  const { open, toggle, selectedOption } = use(OptionCtx)!;
  const options: Record<OptionKey, string> = {
    ticket_count: "Number of Tickets",
    event_type: "Type of Event",
    category: "Event Category",
    start_date: "Start Date & Time",
    end_date: "End Date & Time",
  };

  return (
    <BottomVaul dismissible open={open} onOpenChange={toggle}>
      <div className="h-fit w-screen p-6 md:w-[30rem]">
        <h2 className="font-inter text-lg font-bold tracking-tighter">
          {selectedOption ? options[selectedOption] : ""}
        </h2>
        {children}
        <button
          onClick={toggle}
          className="my-4 flex h-12 w-full items-center justify-center rounded-lg bg-primary font-inter font-semibold tracking-tighter text-white"
        >
          Save changes
        </button>
      </div>
    </BottomVaul>
  );
};
