import type { ReactNode } from "react";

export interface DrawerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  dismissible?: boolean;
  className?: string;
}

export interface HandleProps {
  close: () => void;
  className?: string;
}
