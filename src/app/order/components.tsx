import { useMemo, type PropsWithChildren, memo } from "react";
import { Badge, Button, Image } from "@nextui-org/react";
import { type IconName } from "@/icons/types";
import { cn } from "@/lib/utils";
import type {
  CartItemProps,
  HeaderProps,
  ItemDetail,
  PricingProps,
  ProductImageProps,
  QuantityControlProps,
  QuantityHandler,
  StatProps,
  TicketDetail,
} from "./types";
import { formatAsMoney } from "@/utils/helpers";
import { Iconx } from "@/icons";
import NumberFlow from "@number-flow/react";
import { HyperList } from "@/ui/list";

export const Header = memo(({ itemCount, total }: HeaderProps) => (
  <div className="overflow-hidden rounded-2xl border-[0.33px] border-primary/60 bg-white">
    <div className="flex items-center justify-start space-x-0 bg-gradient-to-br from-cake/40 via-white/40 to-vanilla/60 md:justify-between md:space-x-4 md:px-2">
      <PageHeader />
      <div className="flex w-full items-center justify-end space-x-3 md:space-x-6 lg:space-x-6">
        <Stat label="tickets" value={itemCount} />
        <Stat label="subtotal" value={total} />
      </div>
    </div>
  </div>
));
Header.displayName = "Header";

const PageHeader = memo(() => (
  <div className="group flex h-[50px] min-h-24 w-full cursor-pointer flex-col items-start justify-start overflow-clip p-4">
    <p className="font-inter font-extrabold tracking-tight text-void">
      Order Details
    </p>
  </div>
));
PageHeader.displayName = "PageHeader";

export const Stat = memo(({ label, value }: StatProps) => (
  <div className="flex min-h-24 cursor-pointer flex-col items-end justify-center space-y-2.5 whitespace-nowrap p-4 text-sm md:w-24 lg:w-32">
    <Label>{label}</Label>
    <NumberFlow
      value={value as number}
      locales="en-US"
      willChange
      format={
        label === "subtotal"
          ? {
              currency: "PHP",
              style: "currency",
              maximumFractionDigits: 0,
            }
          : undefined
      }
      className="font-inter text-xl tracking-tight text-primary lg:text-2xl"
    />
  </div>
));
Stat.displayName = "Stat";

export const Label = memo(({ children }: PropsWithChildren) => (
  <p className="text-sm capitalize tracking-tight text-primary/80">
    {children}
  </p>
));
Label.displayName = "Label";

// Utility functions
const undescriptor = (d: string): [string, string, string] => {
  const [venue = "", date = "", org = ""] = d.split("|>");
  return [venue, date, org];
};

const getTicketDetail = (description?: string): TicketDetail => {
  if (!description)
    return { venue: undefined, date: undefined, org: undefined };
  const [venue, date, org] = undescriptor(description);
  return { venue, date, org };
};

const getQuantityStyles = (quantity: number) => ({
  isDisabled: quantity === 0,
  opacity: quantity === 0 ? "opacity-40" : "",
  grayscale: quantity === 0 ? "grayscale" : "",
});

// Memoized Components
export const Description = memo(({ children }: PropsWithChildren) => (
  <p className="max-w-[40ch] overflow-x-scroll text-ellipsis whitespace-nowrap text-xs text-default-500 xl:max-w-[72ch]">
    {children}
  </p>
));
Description.displayName = "Description";

export const ModButton = memo(
  (props: { fn: VoidFunction; icon: IconName; disabled?: boolean }) => (
    <Button
      className={cn(
        "group rounded-full border-[0.33px] border-primary/40 bg-white drop-shadow-sm md:hover:bg-primary md:hover:text-vanilla",
        { hidden: props.disabled },
      )}
      size="sm"
      isIconOnly
      disabled={props.disabled}
      onPress={props.fn}
    >
      <Iconx name={props.icon} className="size-4" />
    </Button>
  ),
);
ModButton.displayName = "ModButton";

export const ProductImage = memo(
  ({ alt, src, quantity }: ProductImageProps) => {
    // Remove the unused opacity style
    return (
      <Badge
        content={quantity}
        shape="rectangle"
        color="secondary"
        size="lg"
        placement="bottom-right"
      >
        <Image
          alt={alt ?? "product-image"}
          src={src ?? "/icon/logomark_v2.svg"}
          isBlurred
          disableAnimation
          className={cn(
            "aspect-auto rounded-xl border-default-400/60 bg-white md:h-36 md:w-40 portrait:h-20 portrait:w-24",
          )}
        />
      </Badge>
    );
  },
);
ProductImage.displayName = "ProductImage";

export const CartItem = memo(({ item, quantity, fn }: CartItemProps) => {
  const { isDisabled, opacity, grayscale } = getQuantityStyles(quantity);

  // Move these calculations outside the render cycle using useMemo
  const detail = useMemo(
    () => getTicketDetail(item?.description),
    [item?.description],
  );

  const price = useMemo(
    () => (item?.price ? formatAsMoney(item.price) : 0),
    [item?.price],
  );

  const itemName = useMemo(
    () => item?.name?.replaceAll(" ", "-").toLowerCase() ?? null,
    [item?.name],
  );

  // Memoize the handlers
  const handlers = useMemo(
    () =>
      ({
        delete: () => item?.id && fn.deleteFn(item.id),
        increment: () => item?.id && fn.incrementFn(item.id),
        decrement: () => item?.id && fn.decrementFn(item.id),
      }) as QuantityHandler,
    [item?.id, fn],
  );

  const lineDetails = useMemo(
    () =>
      [
        { value: detail.venue, icon: "map-marker-fill" },
        { value: detail.date, icon: "calendar-outline" },
      ] as ItemDetail[],
    [detail],
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl border-[0.33px] border-primary/60 bg-white">
      <div
        className={cn(
          "group flex h-48 flex-col items-start justify-between bg-vanilla md:h-[15rem]",
          "cursor-pointer bg-gradient-to-br from-vanilla/60 via-white/40 to-ice/80 px-4 pb-3.5 pt-5 shadow-md shadow-default/40 md:py-3",
          { [`bg-default/40 ${opacity} ${grayscale}`]: isDisabled },
        )}
      >
        <div className="flex w-full items-start space-x-4 md:space-x-6 md:py-1 lg:space-x-8">
          <ProductImage
            alt={itemName}
            src={item?.image ?? "/icon/logomark_v2.svg"}
            quantity={quantity}
          />
          <div
            className={cn(
              "flex w-full flex-col space-y-0.5 overflow-hidden md:space-y-2 lg:space-y-4",
              {
                [opacity]: isDisabled,
              },
            )}
          >
            <LineItemTitle value={item?.name} />
            <HyperList
              data={lineDetails}
              component={LineItemDetail}
              container="w-full space-y-1 overflow-hidden whitespace-nowrap rounded-md p-0.5 font-inter lg:w-fit lg:space-y-2 lg:px-2 lg:py-1.5 lg:pe-4"
            />
          </div>
        </div>

        <div className="flex h-full w-full cursor-pointer items-end justify-between md:p-2 xl:space-x-4">
          <Pricing price={price} unit={"ticket"} />
          <QuantityControls disabled={isDisabled} handlers={handlers} />
        </div>
      </div>
    </div>
  );
});
CartItem.displayName = "CartItem";

const LineItemTitle = ({ value }: { value?: string }) => (
  <div className={cn("mb-2 h-fit w-full truncate lg:mb-1")}>
    <p className="whitespace-pre-wrap text-lg font-bold leading-5 tracking-tight lg:text-2xl">
      {value}
    </p>
  </div>
);

const LineItemDetail = (item: ItemDetail) => (
  <div className="flex items-center">
    <Iconx name={item.icon} className="mr-2.5 size-3.5 opacity-60 md:mr-3" />
    <p className="text-sm capitalize tracking-tight">{item.value}</p>
  </div>
);

const Pricing = ({ price, unit }: PricingProps) => {
  return (
    <div className="flex items-center space-x-2 font-inter">
      <p className="text-lg text-primary">{price}</p>
      <span className="text-sm tracking-tighter opacity-70">
        per <span className="pl-1.5">{unit}</span>
      </span>
    </div>
  );
};

const QuantityControls = ({ disabled, handlers }: QuantityControlProps) => {
  return (
    <div
      className={cn(
        "flex h-fit items-end space-x-4 rounded-full border-[0.33px] border-primary/10 bg-gray-400/60 p-1 opacity-100 md:h-fit md:items-center xl:space-x-4",
        { "space-x-0": disabled },
      )}
    >
      <ModButton fn={handlers.delete} disabled={disabled} icon="close" />
      <ModButton
        fn={handlers.decrement}
        icon="minus-sign"
        disabled={disabled}
      />
      <ModButton fn={handlers.increment} icon="plus-sign" />
    </div>
  );
};
