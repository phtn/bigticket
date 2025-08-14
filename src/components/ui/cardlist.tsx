import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const variants = cva(
  "relative z-100 w-screen border overflow-hidden rounded-b-[3rem]",
  {
    variants: {
      tone: {
        light: "bg-zinc-500 border-gray-700",
        dark: "bg-zinc-800 border-gray-500",
      },
      size: {
        sm: "h-[40lvh] overflow-hidden",
        md: "h-[56lvh] overflow-hidden",
        lg: "h-[70lvh]",
      },
    },
    defaultVariants: {
      tone: "light",
      size: "md",
    },
  },
);

interface HListProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof variants> {}

const HList = forwardRef<HTMLDivElement, HListProps>(
  ({ className, tone, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(variants({ tone, size }), className)}
      {...props}
    />
  ),
);
HList.displayName = "HList";

const HListHeader = forwardRef<HTMLDivElement, HListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  ),
);
HListHeader.displayName = "HListHeader";

const HListTitle = forwardRef<HTMLDivElement, HListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  ),
);
HListTitle.displayName = "HListTitle";

const HListDescription = forwardRef<HTMLDivElement, HListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  ),
);
HListDescription.displayName = "HListDescription";

const HListContent = forwardRef<HTMLDivElement, HListProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  ),
);
HListContent.displayName = "HListContent";

const HListFooter = forwardRef<HTMLDivElement, HListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  ),
);
HListFooter.displayName = "HListFooter";

export {
  HList,
  HListContent,
  HListDescription,
  HListFooter,
  HListHeader,
  HListTitle,
};
