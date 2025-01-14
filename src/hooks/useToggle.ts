"use client";

import { log } from "@/utils/logger";
import { useCallback, useState } from "react";

export const useToggle = () => {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => {
    log("check toggle", open);
    setOpen((v) => !v);
  }, [open]);

  return { open, toggle };
};
