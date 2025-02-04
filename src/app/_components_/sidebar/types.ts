import type { ClassName } from "@/app/types";
import type { IconName } from "@/icons";
import type { FC, ReactNode } from "react";

export interface SidebarProps {
  className?: ClassName;
  children: ReactNode;
}

export interface SidebarListProps<T> {
  title: string;
  data: T[];
  component: FC<T>;
}

export interface IconWrapperProps {
  children?: ReactNode;
  className?: ClassName;
}

export interface ItemCounterProps {
  count: number;
  color?: ClassName;
}

export interface CategoryItem {
  id: number;
  keyId: string;
  label: string;
  href: string;
  icon: IconName;
  count: number;
  color: ClassName;
}
