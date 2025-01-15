import { cn } from "@/lib/utils";
import { motion, type MotionProps } from "motion/react";
import type { HTMLAttributes, ElementType, CSSProperties } from "react";

interface LineShadowProps
  extends Omit<HTMLAttributes<HTMLElement>, keyof MotionProps>,
    MotionProps {
  shadowColor?: string;
  as?: ElementType;
}

export function LineShadow({
  children,
  shadowColor = "black",
  className,
  as: Component = "span",
  ...props
}: LineShadowProps) {
  const MotionComponent = motion.create(Component);
  const content = typeof children === "string" ? children : null;

  if (!content) {
    throw new Error("LineShadowText only accepts string content");
  }

  return (
    <MotionComponent
      style={{ "--shadow-color": shadowColor } as CSSProperties}
      className={cn(
        "relative z-0 inline-flex",
        "after:absolute after:left-[0.08em] after:top-[0.08em] after:content-[attr(data-text)]",
        "after:bg-[linear-gradient(45deg,transparent_45%,var(--shadow-color)_45%,var(--shadow-color)_55%,transparent_0)]",
        "after:-z-10 after:bg-[length:0.06em_0.06em] after:bg-clip-text after:text-transparent",
        "after:animate-line-shadow",
        className,
      )}
      data-text={content}
      {...props}
    >
      {content}
    </MotionComponent>
  );
}
