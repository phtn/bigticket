import { Icon, type IconName } from "@/icons";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export const HyperButton = () => {
  return (
    <button
      type="submit"
      className="flex h-10 items-center gap-1 overflow-hidden rounded-[8px] border-[1.5px] border-primary/40 bg-goddess/80 px-4 drop-shadow-sm md:hover:bg-goddess"
    >
      <Icon name="Plus" className="size-5 text-peach" />
      <span className="text-5xl font-thin opacity-40">/</span>
      <Icon name="Minus" className="size-5 text-peach" />
    </button>
  );
};

interface HyperProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  end?: IconName;
  start?: IconName;
  label?: string;
  loading?: boolean;
  dark?: boolean;
}

export const Hyper = ({
  children,
  start,
  end,
  label,
  loading = false,
  dark = false,
  ...props
}: HyperProps) => {
  return (
    <button
      {...props}
      type="submit"
      className={cn(
        "min-w-lg flex h-10 items-center gap-1 overflow-hidden rounded-sm border-[1.5px] border-primary/40 bg-goddess/80 px-5 drop-shadow-sm transition-all duration-300 active:scale-95 md:hover:text-peach",
        { "bg-primary text-chalk": dark },
      )}
    >
      {start && <Icon name={start} className="size-5 text-peach" />}
      {loading ? (
        <Icon name="SpinnerBall" />
      ) : (
        <span className="font-inter text-sm font-semibold tracking-tight">
          {label}
        </span>
      )}
      {children}
      {end && <Icon name={end} className="size-5 text-peach" />}
    </button>
  );
};
