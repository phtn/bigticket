"use client";

import { useToggle } from "@/hooks/useToggle";
import { type SelectEvent } from "convex/events/d";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
export type OptionKey = keyof Pick<
  SelectEvent,
  | "ticket_count"
  | "event_type"
  | "category"
  | "subcategory"
  | "start_date"
  | "end_date"
>;
interface OptionCtxValues {
  open: boolean;
  toggle: VoidFunction;
  selectedOption: OptionKey | null;
  setSelectedOption: Dispatch<SetStateAction<OptionKey | null>>;
}
export const OptionCtx = createContext<OptionCtxValues | null>(null);

export const OptionCtxProvider = ({ children }: { children: ReactNode }) => {
  const { open, toggle } = useToggle();
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null);
  const value = useMemo(
    () => ({
      open,
      toggle,
      setSelectedOption,
      selectedOption,
    }),
    [open, toggle, selectedOption, setSelectedOption],
  );
  return <OptionCtx value={value}>{children}</OptionCtx>;
};

export const useOption = () => {
  const context = useContext(OptionCtx);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
