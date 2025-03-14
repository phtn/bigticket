import type { HTMLProps, SVGProps } from "react";
import type { IconNameType } from "./icon-list";
export type IconList = Record<IconNameType, { content: string }>;
export type ClassName = HTMLProps<HTMLElement>["className"];

export type IconName = IconNameType;

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconNameType;
  content: string;
  className?: string;
  size?: number;
  color?: string;
  solid?: boolean;
}

export interface IconData {
  symbol: string;
  viewBox?: string;
  set: string;
}
