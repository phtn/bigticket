import type { FC } from "react";
import { icons } from "./icon-list";
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
      {...props}
      dangerouslySetInnerHTML={{ __html: icon.symbol }}
    />
  );
};
