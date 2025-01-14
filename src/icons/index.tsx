import type { SVGProps } from "react";
import { icons } from "./list";

export type IconName = keyof typeof icons;
export type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

export function Icon({
  name,
  fill = "currentColor",
  stroke = "currentColor",
  ...props
}: IconProps) {
  const Component = icons[name];
  if (!Component) {
    console.error(`Icon "${name}" not found.`);
    return null;
  }
  return <Component fill={fill} focusable={false} stroke={stroke} {...props} />;
}
