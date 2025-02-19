import { Icon, type IconName } from "@/icons";
import { cn } from "@/lib/utils";
import { opts } from "@/utils/helpers";
import { useCallback, type ButtonHTMLAttributes, type ReactNode } from "react";

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
  const LabelOptions = useCallback(() => {
    const options = opts(
      <Icon name="SpinnerBall" />,
      <span
        className={cn(
          "font-inter text-xs font-semibold tracking-tighter text-primary",
          { "text-chalk group-hover:text-primary": dark },
        )}
      >
        {label}
      </span>,
    );
    return <>{options.get(loading)}</>;
  }, [dark, label, loading]);
  return (
    <button
      {...props}
      className={cn(
        "group flex h-10 min-w-36 items-center justify-center gap-1 overflow-hidden bg-white px-5 transition-all duration-300 active:scale-95",
        {
          "bg-primary text-chalk hover:bg-gray-200 hover:text-primary": dark,
          "cursor-not-allowed border-gray-200 opacity-60": props.disabled,
        },
      )}
    >
      {start && <Icon name={start} className="size-5 text-peach" />}
      <LabelOptions />
      {children}
      {end && <Icon name={end} className="size-5 text-peach" />}
    </button>
  );
};
