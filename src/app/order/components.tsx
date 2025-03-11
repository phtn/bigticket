import { type PropsWithChildren, type ReactElement } from "react";
import { Badge, Button, Image } from "@nextui-org/react";
import { type ItemProps } from "./ctx";
import { Icon, type IconName } from "@/icons";
import { cn } from "@/lib/utils";

export const Description = ({ children }: PropsWithChildren) => (
  <p className="font-sarabun max-w-[40ch] overflow-x-scroll text-ellipsis whitespace-nowrap text-xs text-default-500 xl:max-w-[72ch]">
    {children}
  </p>
);

interface Fn {
  deleteFn: (name: string) => void;
  cancelFn: VoidFunction;
  incrFn: (name: string) => void;
  decrFn: (name: string) => void;
  saveFn: () => Promise<void>;
  undoFn: VoidFunction;
}
export interface ListItemProps {
  fn: Fn;
  loading: boolean;
  render: (item: ItemProps) => ReactElement;
}

export interface ListItem {
  itemProps: ItemProps;
  fn: Fn;
}

export const ModButton = (props: {
  fn: VoidFunction;
  icon: IconName;
  disabled?: boolean;
}) => (
  <Button
    className={cn(
      "group rounded-full border-[0.33px] border-default-400/90 bg-transparent hover:bg-gray-950 hover:text-sky-50",
      { hidden: props.disabled },
    )}
    size="sm"
    isIconOnly
    disabled={props.disabled}
    onPress={props.fn}
  >
    <Icon
      name={props.icon}
      className="invisible size-4 stroke-1 group-hover:visible"
    />
  </Button>
);

interface ProductImageProps {
  alt: string | null;
  src: string | null;
  quantity: number | null;
}
export const ProductImage = ({ alt, src, quantity }: ProductImageProps) => (
  <Badge
    content={quantity}
    shape="rectangle"
    color="primary"
    size="lg"
    placement="bottom-right"
    className={cn("font-arc bg-gray-800", { "opacity-40": quantity === 0 })}
  >
    <Image
      alt={alt ?? "product image"}
      src={src ?? ""}
      className={cn("h-20 w-auto rounded-xl border-default-400/60 bg-white", {
        "opacity-40": quantity === 0,
      })}
    />
  </Badge>
);

export const Wrapper = ({ children }: PropsWithChildren) => (
  <div
    className={cn(
      "grid w-full grid-cols-1 px-6 lg:grid-cols-10 lg:gap-x-6 lg:px-10 xl:gap-x-10 xl:px-24",
      "_bg-[conic-gradient(at_top_center,_var(--tw-gradient-stops))]",
      "from-stone-50/50 via-zinc-50/50 to-default-50/50",
      // "from-yellow-100/80 via-slate-50/80 to-teal-50/40 backdrop-blur-lg",
      "_border border-primary",
      "bg-white",
    )}
  >
    {children}
  </div>
);

interface HeaderProps {
  itemCount: number | null;
  amount: string;
  categories: (string | undefined)[];
  list: ItemProps[] | undefined;
  subtotal: number;
}

export function Header({
  itemCount,
  amount,
  categories,
  list,
  subtotal,
}: HeaderProps) {
  const findCat = (item: ItemProps) =>
    item.description?.split("--")[1]?.split("|>")[6];

  function getUniqueSet<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
  }

  return (
    <div className="border-[0.33px] border-gray-400/80 shadow-md shadow-default/40">
      <div className="flex items-center justify-start space-x-0 md:justify-between md:space-x-4">
        <PageHeader />
        <div className="flex items-center space-x-0 md:space-x-4">
          <div className="flex items-center justify-start">
            {getUniqueSet(categories)?.map((cat, i) => (
              <Stat
                special
                key={`${cat}_${i}_`}
                label={cat ?? "cat"}
                value={`${Math.round(
                  ((Number(list?.find((item) => findCat(item) === cat)?.price) *
                    Number(
                      list?.find((item) => findCat(item) === cat)?.quantity,
                    )) /
                    subtotal) *
                    100,
                ).toFixed(0)}`}
              />
            ))}
          </div>
          <Stat label="Items" value={itemCount} />
          <Stat label="Subtotal" value={amount} dark />
        </div>
      </div>
    </div>
  );
}

const PageHeader = () => {
  return (
    <div className="group flex size-[64px] min-h-24 cursor-pointer flex-col items-center justify-start space-y-1 overflow-clip bg-white pt-3 md:min-w-16 lg:min-w-24 portrait:hidden">
      <Label>Order Details</Label>
    </div>
  );
};

interface StatProps {
  label: string;
  value: number | string | null;
  dark?: boolean;
  special?: boolean;
}
export const Stat = ({
  label,
  value,
  special = false,
  dark = false,
}: StatProps) => {
  return (
    <div
      className={cn(
        "flex min-h-24 min-w-6 cursor-pointer flex-col items-start space-y-1 whitespace-nowrap p-4 text-sm text-gray-800 transition-all duration-300 ease-out md:min-w-10 lg:min-w-14 xl:min-w-24",
        {
          "min-w-16 bg-default/0 p-4 text-gray-800 md:min-w-20 lg:min-w-32 xl:min-w-40":
            dark,
        },
      )}
    >
      <Label>{label}</Label>
      <div
        className={cn(
          "font-arc text-lg font-medium tracking-tighter lg:text-2xl",
          {
            "font-light text-gray-800": !dark,
          },
          { "font-ibm font-medium": dark },
          { "text-teal-500": special },
          { "text-amber-500": special && Number(value) >= 50 },
          { "text-sky-500": special && Number(value) <= 10 },
        )}
      >
        {value}
        <span className="text-lg">{special ? `%` : ``}</span>
      </div>
    </div>
  );
};

export const Label = ({ children }: PropsWithChildren) => (
  <p className="font-ibm text-xs capitalize tracking-tight text-slate-700">
    {children}
  </p>
);
