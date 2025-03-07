import { type XEvent } from "@/app/types";

export interface BasicContentProps {
  xEvent: XEvent | null;
  pending: boolean;
}

export interface FieldBlockProps {
  pending: boolean;
}
