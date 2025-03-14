// import type { SVGAttributes } from "react";
// import { parseSync } from "svgson";
// import type { IconProps } from "./types";

// export function renderIcon({ content, size, className }: IconProps) {
//   const node = parseSync(content);
//   return (
//     <svg
//       {...node}
//       {...attributes}
//       width={size ?? attributes.width}
//       height={size ?? attributes.height}
//       className={className}
//     >
//       {node.children.map((child, i) =>
//         child.children.map((path, j) => (
//           <path name={path.name} key={String(i + j)} d={path.attributes.d} />
//         )),
//       )}
//     </svg>
//   );
// }

// export const attributes: SVGAttributes<HTMLOrSVGElement> = {
//   xmlns: "http://www.w3.org/2000/svg",
//   width: "24",
//   height: "24",
//   viewBox: "0 0 24 24",
//   fill: "none",
//   stroke: "currentColor",
//   strokeWidth: "1",
//   strokeLinecap: "round",
//   strokeLinejoin: "round",
// };
