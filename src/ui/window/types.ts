import type { ClassName } from "@/app/types";
import type { ReactNode } from "react";
import type { WindowVariant } from ".";
import type { IconName } from "@/icons/types";

export interface StaticToolbarProps {
  closeFn?: VoidFunction;
  children?: ReactNode;
  title?: string;
  variant?: WindowVariant;
  loading?: boolean;
  icon?: IconName;
  action?: VoidFunction;
  className?: ClassName;
}

export interface ToolbarProps<T> {
  closeFn: VoidFunction;
  children?: ReactNode;
  title?: string;
  variant?: WindowVariant;
  loading?: boolean;
  icon?: IconName;
  action?: VoidFunction;
  value?: string;
  size?: "sm" | "md" | "lg" | "xl";
  v?: T;
}
