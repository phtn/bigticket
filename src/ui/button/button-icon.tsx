import type { ClassName } from "@/app/types";
import { Icon, type IconName } from "@/icons";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  bg?: ClassName;
  icon: IconName;
  color?: ClassName;
}
export const ButtonIcon = (props: ButtonIconProps) => (
  <button
    {...props}
    className="group/icon flex size-9 items-center justify-center transition-all duration-300 active:scale-90 active:opacity-80"
  >
    <Icon
      name="Squircle"
      className={cn(
        "absolute z-0 size-9 text-background transition-all duration-200 group-hover/icon:scale-0",
        props.bg,
      )}
    />
    <Icon
      name="Squircle"
      className="z-1 absolute size-9 scale-0 opacity-0 transition-all duration-300 group-hover/icon:scale-100 group-hover/icon:opacity-100"
    />
    <Icon
      name={props.icon}
      className={cn(
        "z-1 transitio-all absolute size-5 duration-300 group-hover/icon:text-white",
        props.color,
      )}
    />
  </button>
);
