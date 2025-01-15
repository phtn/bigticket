import type { ClassName } from "@/app/types";
import { Icon, type IconName } from "@/icons";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { memo, type FC, type ReactNode } from "react";
import { HyperList } from "@/ui/list";
import { ChineCard } from "@/ui/card/chine";

interface SidebarProps {
  open: boolean;
  toggleFn: VoidFunction;
}
export const Sidebar = ({ toggleFn, open }: SidebarProps) => (
  <aside className={cn("absolute z-50 h-full")}>
    <div
      className={cn(
        "relative flex h-[calc(87vh)] w-[360px] -translate-x-[360px] items-center px-8 transition-transform duration-300 portrait:px-4",
        { "translate-x-0": open },
      )}
    >
      <section className="relative h-[calc(80vh)] w-full space-y-2 rounded-xl border-[0.33px] border-primary-100 bg-macl-gray/20 p-2 shadow-lg backdrop-blur-2xl">
        <Button
          size="sm"
          isIconOnly
          onPress={toggleFn}
          className="group absolute -right-2 -top-2 z-[60] rounded-full border-[0.33px] border-primary-300 bg-macl-mint shadow-sm backdrop-blur-lg data-[hover=true]:opacity-100"
        >
          <Icon
            name="LeftChev"
            className="size-4 stroke-transparent text-white"
          />
        </Button>
        <ListTitle title="Events" />
        <EventsList />
        <ListTitle title="Get-Aways" />
        <GetAwaysList />
      </section>
    </div>
  </aside>
);

const ListTitle: FC<{ title: string }> = ({ title }) => (
  <div className="flex h-6 w-full items-center justify-between space-x-3 px-2">
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
    <div className="w-full bg-gradient-to-r from-transparent via-white/30 to-transparent">
      <HyperList keyId="keyId" data={events} component={EventItem} />
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
    <div className="w-full bg-gradient-to-r from-transparent via-white/30 to-transparent">
      <HyperList keyId="keyId" data={getaways} component={GetAwayItem} />
    </div>
  );
};

const EventListItem = (l: Category) => (
  <ChineCard className="cursor-pointer">
    <div className="spacex-5 flex w-full items-center justify-between rounded-xl p-3 hover:bg-white">
      <div className="flex items-center space-x-2">
        <IconWrapper className={cn("mx-2", l.color)}>
          <Icon name={l.icon} className="size-6 shrink-0 drop-shadow-sm" />
        </IconWrapper>
        <h2 className="text-sm tracking-tight text-primary/80">{l.label}</h2>
      </div>
      <ItemCounter count={l.count} color={l.color} />
    </div>
  </ChineCard>
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
    color: "bg-white text-macl-teal",
  },
  {
    id: 1,
    keyId: "concerts",
    label: "Concerts",
    href: "",
    icon: "EGuitarFender",
    count: 1,
    color: "bg-ghost text-macl-pink",
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
    color: "bg-amber-50/80 text-slate-800",
  },
  {
    id: 1,
    keyId: "hotels",
    label: "Hotels",
    href: "",
    icon: "HotelRoom",
    count: 1,
    color: "bg-macl-blue/10 text-slate-600",
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
