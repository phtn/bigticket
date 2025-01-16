import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from "react";
import {
  stopPropagation as stopProp,
  onKeyDown as okd,
  keyListener as kl,
  close as x,
  type FilterProps,
  type Keys,
} from "./utils";

export interface UseWindow {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export const useWindow = ({ open, setOpen }: UseWindow) => {
  const [search, setSearch] = useState("");
  const close = useCallback(() => x(setOpen), [setOpen]);

  const searchFn = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const stopPropagation = useCallback(() => stopProp, []);
  const onKeyDown = useCallback(
    <T, R extends void>(k?: Keys, action?: (p: T | undefined) => R) =>
      okd(k, setOpen, action),
    [setOpen],
  );
  const keyListener = useCallback(
    <T, R extends void>(k?: Keys, action?: (p?: T) => R) =>
      kl(onKeyDown(k, action)),
    [onKeyDown],
  );

  const filterFn = useCallback(
    <T extends FilterProps>(list: T[], max?: number) =>
      list
        .filter(
          (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.description?.toLowerCase().includes(search.toLowerCase()),
        )
        .slice(0, max ?? 5),
    [search],
  );

  return {
    open,
    close,
    search,
    setOpen,
    searchFn,
    filterFn,
    onKeyDown,
    keyListener,
    stopPropagation,
  };
};
