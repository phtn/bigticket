import type { XEvent } from "@/app/types";
import type { ReactNode } from "react";

export interface ContentProps {
  xEvent: XEvent | null;
  pending: boolean;
}

export interface FieldBlockProps {
  pending: boolean;
  children: ReactNode;
}
