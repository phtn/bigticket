import { cn } from "@/lib/utils";
import { useCallback } from "react";

export interface Category {
  id: string;
  value: string;
}

export const categories: Category[] = [
  {
    id: "all",
    value: "all",
  },
  {
    id: "upcoming",
    value: "upcoming",
  },
  {
    id: "events",
    value: "events",
  },
  {
    id: "online",
    value: "online",
  },
  {
    id: "training",
    value: "training",
  },
];

interface CategoryButtonProps {
  fn: VoidFunction;
  selected: string;
  category: Category;
}
export const CategoryButton = ({
  category,
  fn,
  selected,
}: CategoryButtonProps) => {
  const CategoryItem = useCallback(
    (category: Category) => (
      <h2
        className={cn(
          "group mx-auto flex w-fit items-center px-3.5 py-1.5",
          "rounded-full border border-chalk/20 font-inter text-xs",
          "bg-gradient-to-tr from-zinc-400/20 via-gray-500/20 to-slate-500/20",
          "cursor-pointer tracking-tight backdrop-blur-md",
          {
            "border-coal/80 bg-white text-black opacity-100":
              selected === category.id,
          },
          "hover:bg-",
        )}
      >
        <span
          className={cn({
            "rounded-full opacity-80": selected !== category.id,
          })}
        >
          {category.value}
        </span>
      </h2>
    ),
    [selected],
  );
  return (
    <button onClick={fn} className="">
      <CategoryItem {...category} />
    </button>
  );
};
