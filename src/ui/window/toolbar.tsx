import { Icon, type IconName } from "@/icons";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@nextui-org/react";
import { type ChangeEvent, memo } from "react";
import { type WindowVariant } from ".";
import { ButtonIcon } from "../button";
import type { StaticToolbarProps, ToolbarProps } from "./types";

const ToolbarComponent = <T,>({
  children,
  closeFn,
  title,
  variant = "demigod",
  loading = false,
  icon = "Screen",
  action = () => null,
  size = "sm",
}: ToolbarProps<T>) => {
  return (
    <div
      className={cn(
        "flex w-full justify-between rounded-tl-2xl p-2",
        { "h-[49px] items-center": size === "sm" },
        { "h-[80px] items-start": size === "md" },
        { "h-[120px] items-start": size === "lg" },
        // LIGHT
        "border-dock-border border-b-[0.5px]",
        "fill-goddess",
        { "bg-demigod": variant === "demigod" },
        { "bg-god": variant === "god" },
        { "bg-goddess": variant === "goddess" },
        { "bg-adam": variant === "adam" },
        { "bg-void": variant === "void" },
        "",
        // DARK
        "dark:border-zinc-950/80 dark:bg-primary-100",
      )}
    >
      <section className="flex h-12 w-full items-center gap-4">
        <Indicator onPress={action} isLoading={loading} name={icon} />
        {title ? <Title variant={variant} title={title} /> : null}
        {children}
      </section>

      <CloseButton onPress={closeFn} />
    </div>
  );
};

const Title = (props: { title?: string; variant?: WindowVariant }) => {
  return (
    <h2
      className={cn(
        "font-inter text-sm font-semibold tracking-tight text-void/80",
        {
          "text-chalk/90": props.variant === "god",
        },
      )}
    >
      {props.title}
    </h2>
  );
};

const Indicator = (props: ButtonProps & { name: IconName }) => {
  return (
    <Button
      isIconOnly
      className="pointer-events-none ring-0 focus:outline-0"
      variant="light"
      disabled
      size="sm"
      {...props}
    >
      <Icon name={props.name} className="size-4 stroke-0 text-primary/80" />
    </Button>
  );
};

const CloseButton = (props: ButtonProps) => {
  return (
    <Button size="sm" variant="light" {...props} isIconOnly>
      <Icon
        name="Close"
        className={cn("size-4 stroke-0 text-primary/80", {})}
      />
    </Button>
  );
};

export interface ToolbarSearchProps {
  searchFn: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
}
export const ToolbarSearch = (props: ToolbarSearchProps) => {
  const { searchFn, value, placeholder } = props;
  return (
    <div className="relative flex w-full">
      <input
        type="text"
        placeholder={placeholder}
        className={cn(
          "font-inst h-[30px] max-w-[40ch] flex-grow rounded-lg ps-8 text-sm font-semibold outline-none",
          "bg-dock-border text-primary placeholder:text-primary-600",
          "dark:text-icon-dark dark:bg-primary-300/50",
        )}
        defaultValue={value}
        onChange={searchFn}
        autoFocus
      />
      <Icon
        name="Search"
        className="dark:text-dark-icon text-icon absolute left-2 top-2 z-[30] size-3.5 stroke-[3px]"
      />
    </div>
  );
};

export const Toolbar = memo(ToolbarComponent);

export const StaticToolbar = ({
  closeFn,
  children,
  title,
  variant = "demigod",
  icon = "TicketFill",
  className,
}: StaticToolbarProps) => {
  return (
    <div
      className={cn(
        "flex h-[49px] items-center justify-between overflow-hidden p-2",
        // LIGHT
        "border border-b-[0.33px] border-chalk",
        "fill-goddess",
        { "bg-demigod": variant === "demigod" },
        { "bg-primary": variant === "god" },
        { "bg-goddess": variant === "goddess" },
        "",
        // DARK
        "backdrop-blur-sm",
        className,
      )}
    >
      <section className="flex h-12 w-full items-center space-x-2">
        <Icon
          name={icon}
          className={cn("size-5", { "text-gray-200/80": variant === "god" })}
        />

        {title ? <Title title={title} variant={variant} /> : null}
        {children}
      </section>

      <ButtonIcon
        onClick={closeFn}
        icon="Close"
        bg="opacity-0 group-hover/icon:opacity-0"
        color="text-gray-200 group-hover/icon:text-white size-6 stroke-0"
      />
    </div>
  );
};
export interface SpToolbarProps<T> extends ToolbarProps<T> {
  description?: string;
  v?: T;
}
export const SpToolbar = <T,>({
  children,
  // closeFn,
  // title,
  variant = "demigod",
  // loading = false,
  // icon = WindowIcon,
  // action = () => null,
  size = "sm",
}: SpToolbarProps<T>) => {
  return (
    <div
      className={cn(
        "flex w-full justify-between rounded-t-2xl rounded-tr-none p-2",
        { "h-[49px] items-center": size === "sm" },
        { "h-[80px] items-start": size === "md" },
        { "h-[120px] items-start": size === "lg" },
        { "h-[130px] items-start": size === "xl" },
        // LIGHT
        "border-steel border-b-[0.5px]",
        { "bg-demigod": variant === "demigod" },
        { "bg-god": variant === "god" },
        { "bg-goddess": variant === "goddess" },
        "",
        // DARK
        "dark:border-zinc-950/80 dark:bg-primary-100",
      )}
    >
      <section className="flex w-full flex-col items-center justify-center">
        {children}
      </section>
    </div>
  );
};
