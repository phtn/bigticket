import { Iconx } from "@/icons";
import { type IconName } from "@/icons/types";
import { cn } from "@/lib/utils";
import { opts } from "@/utils/helpers";
import Link, { type LinkProps } from "next/link";
import { useCallback, type ButtonHTMLAttributes, type ReactNode } from "react";

export interface HyperProps {
  children?: ReactNode;
  end?: IconName;
  start?: IconName;
  label?: string;
  loading?: boolean;
  dark?: boolean;
  rounded?: boolean;
  fullWidth?: boolean;
  xl?: boolean;
  lg?: boolean;
  sm?: boolean;
  xs?: boolean;
  destructive?: boolean;
  compact?: boolean;
  dim?: boolean;
  active?: boolean;
  center?: boolean;
}

export interface HyperButtonProps
  extends HyperProps,
    ButtonHTMLAttributes<HTMLButtonElement> {}

export const HyperButton = ({ children, ...props }: HyperButtonProps) => {
  return (
    <button
      {...props}
      type="submit"
      className="flex h-10 items-center gap-1 overflow-hidden rounded-[8px] border-[1.5px] border-primary/40 bg-goddess/80 px-4 drop-shadow-sm md:hover:bg-goddess"
    >
      {children}
      <Iconx name="plus-sign" className="size-5 text-peach" />
      <span className="text-5xl font-thin opacity-40">/</span>
      <Iconx name="minus-sign" className="size-5 text-peach" />
    </button>
  );
};

export const Hyper = ({
  children,
  start,
  end,
  label,
  loading = false,
  dark = false,
  rounded = false,
  fullWidth = false,
  xl = false,
  lg = false,
  sm = false,
  xs = false,
  destructive = false,
  compact = false,
  dim = false,
  active = false,
  center = false,
  ...props
}: HyperButtonProps) => {
  const LabelOptions = useCallback(() => {
    const options = opts(
      <Iconx name="spinners-3-dots-move" className="shrink-0 stroke-0" />,
      <span
        className={cn(
          "relative z-10 whitespace-nowrap font-inter text-xs font-semibold tracking-tight text-primary",
          {
            "text-chalk": dark || (destructive && !active),
            "text-primary": dim,
            "text-macd-blue": active,
          },
        )}
      >
        {label}
      </span>,
    );
    return <>{options.get(loading)}</>;
  }, [dark, label, loading, dim, destructive, active]);
  return (
    <button
      {...props}
      className={cn(
        "flex h-11 max-h-14 items-center justify-center overflow-hidden bg-white md:min-w-36",
        "group relative transition-all duration-300 active:scale-95",
        {
          "rounded-lg": rounded,
          "h-12": lg,
          "h-14": xl,
          "w-full px-0": fullWidth,
          "w-fit min-w-0": compact,
          "h-8": sm,
          "h-7": xs,
        },
        props.className,
      )}
    >
      <div className="pointer-events-none absolute z-0 size-full bg-white/20" />
      <div
        className={cn(
          "z-50 flex size-full items-center justify-center",
          "gap-2 md:px-5",
          {
            "px-4": fullWidth,
            "border-0 bg-primary text-chalk hover:bg-coal": dark,
            "bg-macl-red": destructive,
            "bg-demigod hover:bg-teal-500": dim,
            "px-2": compact,
            "px-0": center,
          },
        )}
      >
        {start && (
          <Iconx
            name={start}
            className={cn("z-1 size-5 shrink-0 text-primary", {
              "text-chalk": dark || destructive,
            })}
          />
        )}
        <LabelOptions />
        <div className={props.className}>{children}</div>
        {end && (
          <Iconx
            name={end}
            className={cn("size-5 shrink-0 text-primary", {
              "text-chalk": dark || (destructive && !active),
              "text-macd-blue": active,
            })}
          />
        )}
      </div>
    </button>
  );
};

interface HyperLinkProps extends HyperProps, LinkProps {}
export const HyperLink = ({
  children,
  end,
  start,
  label,
  loading = false,
  dark = false,
  rounded = false,
  fullWidth = false,
  lg = false,
  sm = false,
  destructive = false,
  compact = false,
  dim = false,
  ...props
}: HyperLinkProps) => {
  const LabelOptions = useCallback(() => {
    const options = opts(
      <Iconx name="spinners-bouncing-ball" />,
      <span
        className={cn(
          "font-inter text-xs font-semibold tracking-tighter text-primary",
          { "text-chalk group-hover:text-primary": dark, "text-primary": dim },
        )}
      >
        {label}
      </span>,
    );
    return <>{options.get(loading)}</>;
  }, [dark, label, loading, dim]);
  return (
    <Link
      {...props}
      className={cn(
        "group flex h-10 min-w-36 items-center justify-center gap-1 overflow-hidden border-[0.33px] border-transparent bg-white px-5 transition-all duration-300 active:scale-95",
        {
          "bg-primary text-chalk hover:border-primary hover:bg-gray-200 hover:text-primary":
            dark,
          "rounded-lg": rounded,
          "w-full": fullWidth,
          "h-12": lg,
          "h-8": sm,
          "bg-macl-red": destructive,
          "w-fit": compact,
          "bg-demigod": dim,
        },
      )}
    >
      {start && <Iconx name={start} className="size-5 text-peach" />}
      <LabelOptions />
      {children}
      {end && <Iconx name={end} className="size-5 text-peach" />}
    </Link>
  );
};
