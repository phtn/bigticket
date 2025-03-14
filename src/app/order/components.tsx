import { useCallback, useMemo, type PropsWithChildren, memo } from "react";
import { Badge, Button, Image } from "@nextui-org/react";
import { type IconName } from "@/icons/types";
import { cn } from "@/lib/utils";
import type {
  CartItemProps,
  HeaderProps,
  ProductImageProps,
  StatProps,
  TicketDetail,
} from "./types";
import { formatAsMoney } from "@/utils/helpers";
import { Iconx } from "@/icons/icon";

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
      <Iconx name={props.icon} className="size-4 stroke-1" />
    </Button>
  ),
);
ModButton.displayName = "ModButton";

export const ProductImage = memo(
  ({ alt, src, quantity }: ProductImageProps) => {
    const { opacity } = getQuantityStyles(quantity ?? 0);

    return (
      <Badge
        content={quantity}
        shape="rectangle"
        color="secondary"
        size="lg"
        placement="bottom-right"
        className={cn("", { [opacity]: true })}
      >
        <Image
          alt={alt ?? "product-image"}
          src={src ?? "/icon/logomark_v2.svg"}
          isBlurred
          className={cn(
            "aspect-auto rounded-xl border-default-400/60 bg-white md:h-36 md:w-40 portrait:h-20 portrait:w-24",
            { [opacity]: true },
          )}
        />
      </Badge>
    );
  },
);
ProductImage.displayName = "ProductImage";

export const Wrapper = memo(({ children }: PropsWithChildren) => (
  <div className="grid w-full grid-cols-1 gap-y-10 px-8 md:grid-cols-10 md:gap-x-6 md:gap-y-0 md:px-12 lg:gap-x-8 lg:px-24 xl:gap-x-12 portrait:px-2">
    {children}
  </div>
));
Wrapper.displayName = "Wrapper";

export const Header = memo(({ itemCount, amount }: HeaderProps) => (
  <div className="rounded-2xl border-[0.33px] border-primary bg-white shadow-md shadow-default/40 md:px-2">
    <div className="flex items-center justify-start space-x-0 md:justify-between md:space-x-4">
      <PageHeader />
      <div className="flex w-full items-center justify-end space-x-3 md:space-x-6 lg:space-x-6">
        <Stat label="Tickets" value={itemCount} />
        <Stat label="Subtotal" value={amount} />
      </div>
    </div>
  </div>
));
Header.displayName = "Header";

const PageHeader = memo(() => (
  <div className="group flex h-[50px] min-h-24 w-full cursor-pointer flex-col items-start justify-start overflow-clip p-4">
    <p className="font-inter font-extrabold tracking-tight">Order Details</p>
  </div>
));
PageHeader.displayName = "PageHeader";

export const Stat = memo(
  ({ label, value, special = false, dark = false }: StatProps) => (
    <div className="flex min-h-24 cursor-pointer flex-col items-end justify-center space-y-2.5 whitespace-nowrap p-4 text-sm md:w-32">
      <Label>{label}</Label>
      <div
        className={cn(
          "font-inter text-xl font-medium tracking-tight lg:text-2xl",
          {
            "font-light text-gray-800": !dark,
            "font-medium": dark,
            "text-teal-500": special,
            "text-amber-500": special && Number(value) >= 50,
            "text-sky-500": special && Number(value) <= 10,
          },
        )}
      >
        {value}
        <span className="text-xl">{special ? `%` : ``}</span>
      </div>
    </div>
  ),
);
Stat.displayName = "Stat";

export const Label = memo(({ children }: PropsWithChildren) => (
  <p className="text-xs font-medium capitalize tracking-tight opacity-80">
    {children}
  </p>
));
Label.displayName = "Label";

export const CartItem = memo(({ item, quantity, fn }: CartItemProps) => {
  const { isDisabled, opacity, grayscale } = getQuantityStyles(quantity);

  const detail = useMemo(
    () => getTicketDetail(item?.description),
    [item?.description],
  );

  const handleDelete = useCallback(() => {
    if (item?.id) fn.deleteFn(item.id);
  }, [fn, item?.id]);

  const handleIncrement = useCallback(() => {
    if (item?.id) fn.incrementFn(item.id);
  }, [fn, item?.id]);

  const handleDecrement = useCallback(() => {
    if (item?.id) fn.decrementFn(item.id);
  }, [fn, item?.id]);

  const ticketPrice = useMemo(
    () => (item?.price ? formatAsMoney(item.price) : 0),
    [item?.price],
  );

  const itemName = useMemo(
    () => item?.name?.replaceAll(" ", "-").toLowerCase() ?? null,
    [item?.name],
  );

  return (
    <div
      className={cn(
        "group flex h-40 flex-col items-start justify-between rounded-2xl bg-white md:h-[15rem]",
        "cursor-pointer border-[0.33px] border-primary bg-white px-4 py-3 shadow-md shadow-default/40",
        { [`bg-default/40 px-4 ${opacity} ${grayscale} md:px-8`]: isDisabled },
      )}
    >
      <div className="flex w-full flex-grow items-start space-x-6 md:py-1">
        <ProductImage
          alt={itemName}
          src={item?.image ?? "/icon/logomark_v2.svg"}
          quantity={quantity}
        />
        <div
          className={cn(
            "flex w-full flex-col space-y-1.5 md:space-y-2 lg:space-y-4",
            { [opacity]: isDisabled },
          )}
        >
          <div className={cn("mb-2 h-fit w-full truncate")}>
            <p className="text-lg font-bold tracking-tighter lg:text-xl">
              {item?.name}
            </p>
          </div>
          <div className="flex items-center text-sm">
            <Iconx name="location-01" className="mr-2.5 md:mr-3 md:size-4" />
            <p className="font-semibold capitalize leading-none tracking-tight md:text-sm lg:text-[16px]">
              {detail.venue}
            </p>
          </div>
          <div className="flex items-center text-xs">
            <Iconx
              name="calendar-setting-01"
              className="mr-2.5 md:mr-3 md:size-4"
            />
            <p className="tracking-tight md:text-sm lg:text-[16px]">
              {detail.date}
            </p>
          </div>
        </div>
      </div>

      <div className="flex h-full w-full cursor-pointer items-end justify-between md:p-2 xl:space-x-4">
        <div className="flex items-center space-x-2 font-inter">
          <p className="text-lg">{ticketPrice}</p>
          <span className="text-sm tracking-tighter opacity-80">
            per ticket
          </span>
        </div>
        <div
          className={cn(
            "flex h-fit items-end space-x-4 rounded-full border-[0.33px] border-primary/10 bg-gray-100/60 p-1 opacity-100 md:h-fit md:items-center xl:space-x-4",
            { "space-x-0": isDisabled },
          )}
        >
          <ModButton fn={handleDelete} disabled={isDisabled} icon="close" />
          <ModButton
            fn={handleDecrement}
            icon="minus-sign"
            disabled={isDisabled}
          />
          <ModButton fn={handleIncrement} icon="plus-sign" />
        </div>
      </div>
    </div>
  );
});
CartItem.displayName = "CartItem";

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

/*
const Item = (props: ListItemProps) => {
  const { name, image, description, quantity, price, id, fn } = props;

  const handleDelete = useCallback(() => {
    if (id) fn.deleteFn(id);
  }, [id, fn]);

  const handleIncrement = useCallback(() => {
    if (id) fn.incrementFn(id);
  }, [id, fn]);

  const handleDecrement = useCallback(() => {
    if (id) fn.decrementFn(id);
  }, [id, fn]);

  return (
    <div
      className={cn(
        "font-ibm group flex h-28 cursor-pointer items-center justify-between transition-all ease-out",
        "border-b border-dotted border-primary/20 px-4",
        { "bg-default/40 px-8 opacity-80 grayscale": quantity === 0 },
      )}
    >
      <div className="flex w-[200px] items-center space-x-6">
        <ProductImage
          alt={`${description}_${name}`}
          src={image}
          quantity={quantity}
        />
        <div
          className={cn("flex w-[240px] flex-col space-y-2 leading-none", {
            "opacity-40": quantity === 0,
          })}
        >
          <div className={cn("h-12 whitespace-nowrap")}>
            <p className="font-inter font-semibold tracking-tight">{name}</p>
            <p className="font-inter text-sm text-gray-600">
              {formatAsMoney(price)}
            </p>
          </div>
          <div className="flex items-center space-x-4 leading-none">
            <p className="font-arc text-[10px] font-light opacity-60">
              Ticket number: {id?.split("-").pop()}
            </p>
          </div>
        </div>
      </div>
      <div className="-mb-3 flex cursor-pointer items-end justify-end md:items-start md:space-x-1 xl:space-x-4">
        <div
          className={cn(
            "invisible -mb-2 flex h-fit items-center space-x-3 rounded-full border-x-[12px] border-white bg-white p-1 opacity-100 group-hover:visible xl:space-x-4",
            { "border-x-10 md:space-x-6": quantity === 0 },
          )}
        >
          <ModButton fn={handleIncrement} icon="Plus" />
          <ModButton
            fn={handleDecrement}
            icon="Minus"
            disabled={quantity === 0}
          />
          <ModButton fn={handleDelete} icon="CloseLight" />
        </div>
      </div>
    </div>
  );
};
*/

// const Line = (item: ItemProps) => (
//   <div className="flex items-center justify-between">
//     <div className="flex items-center space-x-3">
//       <span>{item.name}</span>

//       <Iconx name="close" className="size-2 text-orange-400" />
//       <span>{item.quantity}</span>
//     </div>
//     <span className="tracking-wider">
//       {formatAsMoney(item.quantity * item.price)}
//     </span>
//   </div>
// );
