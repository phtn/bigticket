import { type PropsWithChildren } from "react";
import { Badge, Button, Image } from "@nextui-org/react";
import { Icon, type IconName } from "@/icons";
import { cn } from "@/lib/utils";
import type { HeaderProps, ProductImageProps, StatProps } from "./types";

export const Description = ({ children }: PropsWithChildren) => (
  <p className="font-sarabun max-w-[40ch] overflow-x-scroll text-ellipsis whitespace-nowrap text-xs text-default-500 xl:max-w-[72ch]">
    {children}
  </p>
);

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

export const ProductImage = ({ alt, src, quantity }: ProductImageProps) => {
  return (
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
        src={src ?? "/icon/logomark_v2.svg"}
        className={cn(
          "aspect-auto h-20 w-24 rounded-xl border-default-400/60 bg-white",
          {
            "opacity-40": quantity === 0,
          },
        )}
      />
    </Badge>
  );
};

export const Wrapper = ({ children }: PropsWithChildren) => (
  <div
    className={cn(
      "grid w-full grid-cols-1 gap-y-8 px-2 md:grid-cols-10 md:gap-x-6 md:gap-y-0 lg:gap-x-8 lg:px-10 xl:gap-x-12 xl:px-24",
      "from-stone-50/50 via-zinc-50/50 to-default-50/50",
    )}
  >
    {children}
  </div>
);

export function Header({ itemCount, amount }: HeaderProps) {
  return (
    <div className="rounded-2xl border-2 border-secondary bg-white shadow-md shadow-default/40">
      <div className="flex items-center justify-start space-x-0 md:justify-between md:space-x-4">
        <PageHeader />
        <div className="flex w-full items-center justify-between space-x-3 md:space-x-14">
          <Stat label="Items" value={itemCount} />
          <Stat label="Subtotal" value={amount} dark />
        </div>
      </div>
    </div>
  );
}

const PageHeader = () => {
  return (
    <div className="group flex h-[50px] min-h-24 w-full cursor-pointer flex-col items-start justify-start overflow-clip p-4">
      <p className="font-inter font-extrabold tracking-tight">Order Details</p>
    </div>
  );
};

export const Stat = ({
  label,
  value,
  special = false,
  dark = false,
}: StatProps) => {
  return (
    <div
      className={cn(
        "flex min-h-24 min-w-6 cursor-pointer flex-col items-end justify-center space-y-2.5 whitespace-nowrap p-4 text-sm text-gray-800 transition-all duration-300 ease-out md:min-w-12 lg:min-w-16 xl:min-w-24",
        {
          "min-w-16 bg-default/0 p-4 text-gray-800 md:min-w-20 lg:min-w-32 xl:min-w-40":
            dark,
        },
      )}
    >
      <Label>{label}</Label>
      <div
        className={cn(
          "font-sans text-lg font-semibold tracking-wide lg:text-2xl",
          {
            "font-light text-gray-800": !dark,
          },
          { "font-medium": dark },
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
  <p className="text-xs capitalize tracking-tight">{children}</p>
);

/*
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
*/
