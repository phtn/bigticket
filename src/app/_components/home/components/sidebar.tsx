import { SidebarCtx } from "@/app/ctx/sidebar";
import type { ClassName } from "@/app/types";
import { Icon, type IconName } from "@/icons";
import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { Button } from "@nextui-org/react";
import { memo, use, type FC, type ReactNode } from "react";

export const Sidebar = () => {
  const { toggle, open } = use(SidebarCtx)!;
  return (
    <aside className={cn("absolute z-50")}>
      <div
        className={cn(
          "fixed flex w-[360px] -translate-x-[360px] items-start px-8 py-4 transition-transform duration-300 portrait:px-4",
          { "translate-x-0": open },
        )}
      >
        <Button
          size="sm"
          isIconOnly
          variant="ghost"
          color="default"
          onPress={toggle}
          className="group absolute right-6 top-6 z-[60] border-0 data-[hover=true]:opacity-100"
        >
          <Icon name="LeftChev" className="size-5 stroke-0 text-slate-500" />
        </Button>
        <section className="relative w-full space-y-6 rounded-xl border-[0.33px] border-primary-100 bg-chalk/80 p-2 shadow-lg backdrop-blur-2xl md:h-[calc(80vh)]">
          <EventsList />
          <GetAwaysList />
          <ListTitle title="big ticket" />
        </section>
      </div>
    </aside>
  );
};

const ListTitle: FC<{ title: string }> = ({ title }) => (
  <div className="flex h-10 w-full items-center justify-between space-x-3 px-2">
    <p className="whitespace-nowrap text-[11px] font-semibold uppercase text-slate-600 drop-shadow-sm">
      {title}
    </p>
  </div>
);

interface IconWrapperProps {
  children?: ReactNode;
  className?: ClassName;
}

const IconWrapper = ({ children, className }: IconWrapperProps) => (
  <div
    className={cn(
      className,
      "flex size-6 flex-shrink-0 items-center justify-center rounded-full",
    )}
  >
    {children}
  </div>
);

const ItemCounter = (props: { count: number; color?: ClassName }) => (
  <div className="relative flex h-8 w-9 items-center justify-center">
    <Icon
      name="Squircle"
      className={cn(
        "absolute right-[4px] size-8 opacity-20",
        props.color?.split(" ")[1],
      )}
    />
    <Icon
      name="Squircle"
      className={cn(
        "absolute right-[1.5px] size-8 opacity-5",
        props.color?.split(" ")[1],
      )}
    />
    <Icon
      name="Squircle"
      className="absolute right-[2px] size-8 text-ghost opacity-80"
    />
    <p
      className={cn(
        "absolute font-sans text-xs font-medium",
        props.color?.split(" ")[1],
      )}
    >
      {props.count}
    </p>
  </div>
);

const EventsList = () => {
  return (
    <div>
      <ListTitle title="Events" />
      <div className="w-full rounded-xl bg-white/80">
        <HyperList keyId="id" data={events} component={EventItem} />
      </div>
    </div>
  );
};

const GetAwayListItem = (l: Category) => (
  <div className="spacex-5 flex w-full items-center justify-between rounded-xl p-3 hover:bg-white">
    <div className="flex items-center space-x-2">
      <IconWrapper className={cn("mx-2", l.color)}>
        <Icon name={l.icon} className="size-6 shrink-0" />
      </IconWrapper>
      <h2 className="text-sm tracking-tight text-primary/80">{l.label}</h2>
    </div>
    <ItemCounter count={l.count} color={l.color} />
  </div>
);

const GetAwayItem = memo(GetAwayListItem);

const GetAwaysList = () => {
  return (
    <div>
      <ListTitle title="Get-Aways" />
      <div className="w-full rounded-xl bg-white/80">
        <HyperList keyId="id" data={getaways} component={GetAwayItem} />
      </div>
    </div>
  );
};

const EventListItem = (l: Category) => (
  <div className="spacex-5 flex w-full items-center justify-between rounded-xl p-3 hover:bg-white">
    <div className="flex items-center space-x-2">
      <IconWrapper className={cn("mx-2", l.color)}>
        <Icon name={l.icon} className="size-6 shrink-0 drop-shadow-sm" />
      </IconWrapper>
      <h2 className="text-sm tracking-tight text-primary/80">{l.label}</h2>
    </div>
    <ItemCounter count={l.count} color={l.color} />
  </div>
);

const EventItem = memo(EventListItem);

interface Category {
  id: number;
  keyId: string;
  label: string;
  href: string;
  icon: IconName;
  count: number;
  color: ClassName;
}

const events: Category[] = [
  {
    id: 0,
    keyId: "nightlife",
    label: "Nightlife",
    href: "",
    icon: "Cocktail",
    count: 29,
    color: "bg-macl-indigo text-slate-800",
  },
  {
    id: 1,
    keyId: "concerts",
    label: "Concerts",
    href: "",
    icon: "EGuitarFender",
    count: 1,
    color: "bg-macl-mint text-slate-800",
  },
];

const getaways: Category[] = [
  {
    id: 0,
    keyId: "flights",
    label: "Flights",
    href: "",
    icon: "Airplane2",
    count: 0,
    color: "bg-amber-300/80 text-slate-800",
  },
  {
    id: 1,
    keyId: "hotels",
    label: "Hotels",
    href: "",
    icon: "HotelRoom",
    count: 1,
    color: "bg-macl-blue/10 text-slate-800",
  },
];

export const shops: Category[] = [
  {
    id: 0,
    keyId: "shopping",
    label: "Shopping",
    href: "",
    icon: "Fire",
    count: 0,
    color: "bg-macl-blue/10 text-macl-blue",
  },
  {
    id: 1,
    keyId: "restaurants",
    label: "Restaurants",
    href: "",
    icon: "InfoLine",
    count: 1,
    color: "bg-macl-blue/10 text-macl-pink",
  },
  {
    id: 2,
    keyId: "wellness",
    label: "Wellness",
    href: "",
    icon: "InfoLine",
    count: 1,
    color: "bg-macl-blue/10 text-macl-pink",
  },
  {
    id: 3,
    keyId: "vouchers",
    label: "Vouchers",
    href: "",
    icon: "InfoLine",
    count: 1,
    color: "bg-macl-blue/10 text-macl-pink",
  },
];

// const SidebarContent = () => {
//   return (
//     <Listbox
//       aria-label="Categories"
//       className="w-full gap-0 overflow-visible p-0"
//       itemClasses={{
//         base: "px-3 gap-3 font-medium h-12 data-[hover=true]:bg-ghost",
//       }}
//       onAction={(key) => alert(key)}
//     >
//       <ListboxItem
//         key="nightlife"
//         endContent={<ItemCounter count={13} />}
//         startContent={
//           <IconWrapper className="bg-success/10 text-success">
//             <Icon name="Fire" className="text-lg" />
//           </IconWrapper>
//         }
//       >
//         <span className="font-semibold">Nightlife</span>
//       </ListboxItem>
//       <ListboxItem
//         key="concerts"
//         endContent={<ItemCounter count={79} />}
//         startContent={
//           <IconWrapper className="bg-warning/10 text-warning">
//             <Icon name="Fire" className="text-lg" />
//           </IconWrapper>
//         }
//       >
//         Concerts
//       </ListboxItem>
//       <ListboxItem
//         key="get_aways"
//         endContent={<ItemCounter count={6} />}
//         startContent={
//           <IconWrapper className="bg-primary/10 text-primary">
//             <Icon name="Fire" className="text-lg" />
//           </IconWrapper>
//         }
//       >
//         Flights
//       </ListboxItem>
//       <ListboxItem
//         key="hotels"
//         endContent={<ItemCounter count={2} />}
//         startContent={
//           <IconWrapper className="bg-warning/10 text-warning">
//             <Icon name="Fire" className="text-lg" />
//           </IconWrapper>
//         }
//       >
//         Hotels
//       </ListboxItem>
//       <ListboxItem
//         key="wellness"
//         endContent={<ItemCounter count={293} />}
//         startContent={
//           <IconWrapper className="bg-secondary/10 text-secondary">
//             <Icon name="Fire" className="text-lg" />
//           </IconWrapper>
//         }
//       >
//         Wellness
//       </ListboxItem>
//       <ListboxItem
//         key="shopping"
//         endContent={<ItemCounter count={4} />}
//         startContent={
//           <IconWrapper className="bg-default/50 text-foreground">
//             <Icon name="Fire" className="text-lg" />
//           </IconWrapper>
//         }
//       >
//         Shopping
//       </ListboxItem>
//       <ListboxItem
//         key="vouchers"
//         endContent={<ItemCounter count={4} />}
//         startContent={
//           <IconWrapper className="bg-default/50 text-foreground">
//             <Icon name="Fire" className="text-lg" />
//           </IconWrapper>
//         }
//       >
//         Vouchers
//       </ListboxItem>
//     </Listbox>
//   );
// };
