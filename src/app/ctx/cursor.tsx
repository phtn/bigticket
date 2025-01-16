import React, { createContext, useCallback, useMemo, useState } from "react";

interface CursorCtxValues {
  isInputHovered: boolean;
  handleInputHover: (hovered: boolean) => () => void;
}

export const CursorCtx = createContext<CursorCtxValues | null>(null);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
