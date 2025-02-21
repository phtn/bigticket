import { Icon } from "@/icons";
import { type ReactNode } from "react";
import { motion } from "motion/react";
import { Spinner } from "@nextui-org/react";

interface HeaderProps {
  children?: ReactNode;
  title: string;
}
export const Header = ({ title, children }: HeaderProps) => (
  <div className="flex h-16 items-center whitespace-nowrap">
    <motion.div
      initial={{ opacity: 0, x: 5 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex h-16 items-center gap-2"
    >
      <h1 className="ps-4 font-inter text-lg font-semibold tracking-tighter md:text-xl">
        {title}
      </h1>
      {children}
    </motion.div>
  </div>
);

export const Count = (props: { count: number | undefined }) => (
  <div className="relative flex size-8 items-center justify-center">
    <Icon
      name="Squircle"
      className="absolute z-0 size-8 text-primary md:size-8"
    />
    <p className="z-1 relative font-inter text-sm font-bold text-chalk md:text-[16px]">
      {props.count}
    </p>
  </div>
);

interface EmptyListProps {
  title: string;
  count: number;
  message: string;
  loading?: boolean;
}
export const EmptyList = ({
  count,
  message,
  title,
  loading = false,
}: EmptyListProps) => {
  return (
    <div className="space-y-6">
      <Header title={title}>
        {loading ? <Spinner size="sm" /> : <Count count={count} />}
      </Header>
      <div className="flex items-center justify-center">
        <div className="flex h-20 min-w-56 animate-enter items-center justify-center font-inter text-sm tracking-tighter opacity-80">
          {loading ? <Icon name="SpinnerBall" /> : message}
        </div>
      </div>
    </div>
  );
};
