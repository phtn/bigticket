import type { ClassName } from "@/app/types";
import { Icon, type IconName } from "@/icons";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  bg?: ClassName;
  icon: IconName;
  color?: ClassName;
  shadow?: ClassName;
}
export const ButtonIcon = (props: ButtonIconProps) => (
  <button
    {...props}
    className="group/icon flex size-10 items-center justify-center transition-all duration-300 active:scale-90 active:opacity-80"
  >
    <Icon
      name="Squircle"
      className={cn(
        "absolute z-0 size-10 text-background transition-all duration-100",
        props.bg,
      )}
    />
    <Icon
      name="Squircle"
      className={cn(
        "z-1 absolute size-10 scale-0 text-teal-600 opacity-0",
        "transition-all duration-200 group-hover/icon:scale-100",
        props.shadow,
      )}
    />
    <Icon
      name={props.icon}
      className={cn(
        "z-1 transitio-all absolute size-4 duration-300 group-hover/icon:size-5 group-hover/icon:text-gray-600",
        props.color,
      )}
    />
  </button>
);
