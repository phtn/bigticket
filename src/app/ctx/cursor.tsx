import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

interface CursorCtxValues {
  isInputHovered: boolean;
  handleInputHover: (hovered: boolean) => () => void;
}

export const CursorCtx = createContext<CursorCtxValues | null>(null);

export const CursorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isInputHovered, setIsInputHovered] = useState<boolean>(false);

  const handleInputHover = useCallback(
    (hovered: boolean) => () => setIsInputHovered(hovered),
    [setIsInputHovered],
  );

  const value = useMemo(
    () => ({ isInputHovered, handleInputHover }),
    [isInputHovered, handleInputHover],
  );

  return <CursorCtx value={value}>{children}</CursorCtx>;
};
