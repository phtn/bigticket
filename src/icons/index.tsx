import type { FC } from "react";
import { icons } from "./icons";
import type { IconProps } from "./types";

export const Iconx: FC<Omit<IconProps, "content">> = ({
  name,
  className,
  size = 24,
  color = "currentColor",
  solid = false,
  ...props
}) => {
  const icon = icons[name];

  if (!icon || !icon.symbol) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  // Validate icon.symbol to prevent XSS (if icon data comes from external sources)
  const isSafeSvgContent =
    typeof icon.symbol === "string" &&
    /^<(?:path|circle|rect|line|polyline|polygon)(?:\s+[^>]*?)?\/?>$/;

  if (!isSafeSvgContent) {
    console.error(`Icon "${name}" contains potentially unsafe content`);
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={"0 0 24 24"}
      width={size}
      height={size}
      className={className}
      fill={solid ? color : "none"}
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-hidden="true"
      {...props}
      dangerouslySetInnerHTML={{ __html: icon.symbol }}
    />
  );
};
