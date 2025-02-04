import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import type { FC, PropsWithChildren, ReactNode } from "react";
import { useEffect } from "react";
import { StaticToolbar, Toolbar } from "./toolbar";
import { type UseWindow, useWindow } from "./useWindow";
import type { ClassName } from "@/app/types";
import { type Keys } from "./utils";
import type { ToolbarProps, StaticToolbarProps } from "./types";
import type { IconName } from "@/icons";

export type WindowVariant = "demigod" | "god" | "goddess" | "adam" | "void";
interface DialogWindowProps<S> extends UseWindow {
  k?: Keys;
  value?: string;
  children?: ReactNode;
  action?: <T, R>(p: T) => R;
  variant?: WindowVariant;
  shadow?: "sm" | "md" | "lg" | "xl";
  toolbar?: FC<ToolbarProps<S>>;
  title?: string;
}

export const DialogWindow = <T,>(props: DialogWindowProps<T>) => {
  const {
    k,
    action,
    children,
    shadow = "xl",
    title,
    variant,
    value,
    setOpen,
  } = props;

  const { open, close, keyListener, stopPropagation } = useWindow({
    open: props.open,
    setOpen,
  });

  const { add, remove } = keyListener(k, action);

  useEffect(() => {
    add();
    return () => remove();
  }, [add, remove]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 flex items-center justify-center bg-opacity-10 p-4",
          )}
          // onClick={close}
        >
          <motion.div
            drag
            dragMomentum={false}
            initial={{ scale: 0.95, opacity: 0, borderRadius: 112 }}
            animate={{ scale: 1, opacity: 1, borderRadius: 16 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            className={cn(
              "z-50 w-full max-w-2xl overflow-hidden shadow-xl",
              "rounded-2xl",
              { "shadow-xl": shadow === "xl" },
              { "shadow-lg": shadow === "lg" },
              { "shadow-md": shadow === "md" },
              { "shadow-sm": shadow === "sm" },
              "dark:border-fade-dark/90 dark:bg-void",
              "border-fade-dark/40 border-[0.33px] bg-white",
            )}
            onClick={stopPropagation}
          >
            {props.toolbar ? (
              <props.toolbar
                value={value}
                title={title}
                closeFn={close}
                variant={variant}
              />
            ) : (
              <Toolbar
                title={title}
                value={value}
                closeFn={close}
                variant={variant}
              />
            )}

            <WindowContent>{children}</WindowContent>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface WindowProps {
  children?: ReactNode;
  className?: ClassName;
  variant?: WindowVariant;
  shadow?: "sm" | "md" | "lg" | "xl";
  toolbar?: FC<StaticToolbarProps>;
  title?: string;
  icon?: IconName;
  closeFn?: VoidFunction;
  wrapperStyle?: ClassName;
}
export function Window(props: WindowProps) {
  const {
    children,
    shadow = "xl",
    title,
    variant,
    closeFn,
    wrapperStyle,
  } = props;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "flex w-full items-center justify-center rounded-2xl rounded-tr-none bg-void",
        )}
      >
        <motion.div
          drag
          dragMomentum={false}
          initial={{ scale: 0.95, opacity: 0, borderRadius: 112 }}
          animate={{ scale: 1, opacity: 1, borderRadius: 16 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          className={cn(
            "w-full overflow-hidden shadow-xl",
            "rouned-tr-none rounded-2xl",
            { "shadow-xl": shadow === "xl" },
            { "shadow-lg": shadow === "lg" },
            { "shadow-md": shadow === "md" },
            { "shadow-sm": shadow === "sm" },
            "dark:border-fade-dark/90 dark:bg-void",
            "border-fade-dark/20 border-[0.33px] bg-chalk",
            wrapperStyle,
          )}
        >
          {props.toolbar ? (
            <props.toolbar title={title} variant={variant} />
          ) : (
            <StaticToolbar
              closeFn={closeFn}
              icon={props.icon}
              title={title}
              variant={variant}
            />
          )}

          <WindowContent>{children}</WindowContent>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function FlatWindow(props: WindowProps) {
  const {
    children,
    shadow = "xl",
    title,
    variant,
    closeFn,
    className,
    wrapperStyle,
  } = props;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn("flex w-full items-center justify-center")}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "w-full overflow-hidden shadow-xl",
            "bg-white",
            wrapperStyle,
            { "shadow-xl": shadow === "xl" },
            { "shadow-lg": shadow === "lg" },
            { "shadow-md": shadow === "md" },
            { "shadow-sm": shadow === "sm" },
          )}
        >
          {props.toolbar ? (
            <props.toolbar title={title} variant={variant} />
          ) : (
            <StaticToolbar
              className={className}
              closeFn={closeFn}
              icon={props.icon}
              title={title}
              variant={variant}
            />
          )}

          <WindowContent>{children}</WindowContent>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export const WindowContent = ({ children }: PropsWithChildren) => (
  <div className={cn("relative overflow-hidden")}>
    <div className="bg-shadow/90 absolute top-0 h-[0.5px] w-full dark:bg-primary-200/80" />

    {children}
  </div>
);
