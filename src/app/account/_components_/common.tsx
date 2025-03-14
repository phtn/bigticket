import { type IconName } from "@/icons/types";
import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { type ClassName } from "@/app/types";
import { Iconx } from "@/icons/icon";

interface HeaderProps {
  children?: ReactNode;
  title: string;
}
export const Header = ({ title, children }: HeaderProps) => (
  <div className="flex h-16 items-center whitespace-nowrap">
    <motion.div
      initial={{ opacity: 0, x: 4 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex h-16 items-center gap-2"
    >
      <h1 className="ps-4 font-inter text-lg font-semibold capitalize tracking-tighter md:text-xl">
        {title}
      </h1>
      {children}
    </motion.div>
  </div>
);

export const Count = (props: { count: number | undefined }) => (
  <div className="relative flex size-8 items-center justify-center">
    <Iconx
      name="squircle"
      className="absolute z-0 size-8 text-primary md:size-8"
    />
    <p className="z-1 relative font-inter text-sm font-bold text-chalk md:text-[16px]">
      {props.count}
    </p>
  </div>
);

interface EmptyListProps {
  message: string;
  loading?: boolean;
  icon: IconName;
  className?: ClassName;
}
export const EmptyList = ({
  icon,
  message,
  loading = false,
  className,
}: EmptyListProps) => {
  return (
    <div
      className={cn(
        "relative flex h-56 w-full items-center justify-center space-y-6",
        className,
      )}
    >
      <Iconx
        name={icon}
        className="pointer-events-none absolute size-40 text-gray-100"
      />
      <div
        className={cn(
          "z-1 relative flex w-72 items-center justify-center rounded-xl border-[0.33px] border-macl-gray/60 bg-white/10 py-3 backdrop-blur-md transition-all duration-300",
          { "w-8": loading },
        )}
      >
        <div className="flex animate-enter items-center justify-center font-inter text-sm font-medium tracking-tighter text-gray-600 opacity-80">
          {loading ? <Iconx name="spinners-bouncing-ball" /> : message}
        </div>
      </div>
    </div>
  );
};
