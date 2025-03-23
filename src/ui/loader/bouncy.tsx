import { type ClassName, type SetState } from "@/app/types";
import { Iconx } from "@/icons";
import { cn } from "@/lib/utils";
import { Err } from "@/utils/helpers";
import { useEffect, useState } from "react";

function* circularLoop(array: number[]) {
  let index = 0;
  while (true) {
    yield array[index];
    index = (index + 1) % array.length;
  }
}

export async function runWithDelay(
  array: number[],
  delayMs: number,
  set: SetState<number>,
) {
  const iterator = circularLoop(array);

  while (true) {
    const { value } = iterator.next();
    set(value ?? 0);
    await new Promise((resolve) => setTimeout(resolve, delayMs)); // Wait before next iteration
  }
}

interface BouncyProps {
  colorMap?: Record<number, string>;
  className?: ClassName;
}

export const Bouncy = ({
  className,
  colorMap = {
    0: "text-void",
    1: "text-white",
  },
}: BouncyProps) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    runWithDelay([0, 1], 650, setCurrent).catch(Err);
  }, []);
  return (
    <Iconx
      name="spinners-bouncing-ball"
      className={cn(
        "transition-colors duration-700",
        colorMap[current],
        className,
      )}
    />
  );
};
