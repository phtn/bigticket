import { type ClassName } from "@/app/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { type FC, memo, type ReactNode, useCallback, useMemo } from "react";

interface HyperListProps<T> {
  keyId?: keyof T;
  component: FC<T>;
  data: T[] | undefined;
  container?: ClassName;
  itemStyle?: ClassName;
  reversed?: boolean;
  orderBy?: keyof T;
  max?: number;
  children?: ReactNode;
}
export const ListComponent = <T extends object>(props: HyperListProps<T>) => {
  const {
    data,
    keyId,
    container,
    itemStyle,
    max = 15,
    component: Item,
    reversed = false,
    orderBy = "updated_at",
    children,
  } = props;

  const baseContainerStyle = useMemo(
    () => cn("max-h-60vh overflow-y-auto", container),
    [container],
  );

  const baseItemStyle = useMemo(() => cn("group/list", itemStyle), [itemStyle]);

  const transition = (i: number) => ({ delay: i * 0.05 });

  const slicedData = useMemo(
    () => (reversed ? data?.slice(0, max).reverse() : data?.slice(0, max)),
    [data, max, reversed],
  );

  const render = useCallback(
    (i: T, j: number) => {
      const key = keyId && keyId in i ? String(i[keyId]) : String(j);
      return (
        <motion.li
          key={key}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(j)}
          className={baseItemStyle}
        >
          <Item {...i} />
        </motion.li>
      );
    },
    [Item, baseItemStyle, keyId],
  );

  const sortFn = useCallback(
    (a: T, b: T) => {
      if (orderBy in b && orderBy in a) {
        return Number(b[orderBy as keyof T]) - Number(a[orderBy as keyof T]);
      }
      return 0;
    },
    [orderBy],
  );

  return (
    <AnimatePresence>
      {children}
      <ul className={baseContainerStyle}>
        {slicedData?.sort(sortFn).map(render)}
      </ul>
    </AnimatePresence>
  );
};

export const HyperList = memo(ListComponent) as typeof ListComponent;
