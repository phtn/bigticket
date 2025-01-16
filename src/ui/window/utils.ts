import type { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from "react";

export interface FilterProps {
  id?: number | string;
  name: string;
  description?: string;
}
export type Keys = "j" | "k" | "i" | "'" | ".";

export const filterFn = <T extends FilterProps>(
  list: T[],
  key: string,
  max?: number,
) =>
  list
    .filter(
      (item) =>
        item.name.toLowerCase().includes(key.toLowerCase()) ||
        item.description?.toLowerCase().includes(key.toLowerCase()),
    )
    .slice(0, max ?? 5);

export const onKeyDown =
  <T, R extends void>(
    k: Keys | undefined,
    setOpen: Dispatch<SetStateAction<boolean>>,
    action?: (p?: T) => R,
  ) =>
  (e: KeyboardEvent) => {
    if (k && e.key === k && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((prev) => !prev);
      if (typeof action !== "undefined") {
        action();
      }
    }
  };

export const keyListener = (keydownFn: (e: KeyboardEvent) => void) => {
  return {
    add: () => document.addEventListener("keydown", keydownFn),
    remove: () => document.removeEventListener("keydown", keydownFn),
  };
};

export const close = (setOpen: Dispatch<SetStateAction<boolean>>) =>
  setOpen(false);

export const searchFn =
  (setSearch: Dispatch<SetStateAction<string>>) =>
  (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

export const stopPropagation = (e: MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};
