import { Icon, type IconName } from "@/icons";
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
  lg?: boolean;
  destructive?: boolean;
  compact?: boolean;
  dim?: boolean;
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
      <Icon name="Plus" className="size-5 text-peach" />
      <span className="text-5xl font-thin opacity-40">/</span>
      <Icon name="Minus" className="size-5 text-peach" />
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
  lg = false,
  destructive = false,
  compact = false,
  dim = false,
  ...props
}: HyperButtonProps) => {
  const LabelOptions = useCallback(() => {
    const options = opts(
      <Icon name="SpinnerBall" />,
      <span
        className={cn(
          "font-inter text-xs font-semibold tracking-tighter text-primary transition-all duration-300",
          {
            "text-chalk": dark,
            "text-primary group-hover:text-white": dim,
          },
        )}
      >
        {label}
      </span>,
    );
    return <>{options.get(loading)}</>;
  }, [dark, label, loading, dim]);
  return (
    <button
      {...props}
      className={cn(
        props.className,
        "group flex h-10 w-36 items-center justify-center gap-1.5 overflow-hidden border-[0.33px] border-transparent bg-white px-5 transition-all duration-300 active:scale-95",
        {
          "bg-primary text-chalk hover:border-primary hover:bg-chalk/5": dark,
          "rounded-lg": rounded,
          "w-full": fullWidth,
          "h-12": lg,
          "bg-macl-red": destructive,
          "w-fit": compact,
          "bg-demigod": dim,
        },
      )}
    >
      {start && (
        <Icon
          name={start}
          className={cn("size-3.5 text-primary", { "text-chalk": dark })}
        />
      )}
      <LabelOptions />
      {children}
      {end && (
        <Icon
          name={end}
          className={cn("size-3.5 text-primary", { "text-chalk": dark })}
        />
      )}
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
  destructive = false,
  compact = false,
  dim = false,
  ...props
}: HyperLinkProps) => {
  const LabelOptions = useCallback(() => {
    const options = opts(
      <Icon name="SpinnerBall" />,
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
          "bg-macl-red": destructive,
          "w-fit": compact,
          "bg-demigod": dim,
        },
      )}
    >
      {start && <Icon name={start} className="size-5 text-peach" />}
      <LabelOptions />
      {children}
      {end && <Icon name={end} className="size-5 text-peach" />}
    </Link>
  );
};
