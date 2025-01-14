import type { ClassName } from "@/app/types";
import { Icon, type IconName } from "@/icons";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { memo, type FC, type ReactNode } from "react";
import { HyperList } from "@/ui/list";

interface SidebarProps {
  toggleFn: VoidFunction;
}
export const Sidebar = ({ toggleFn }: SidebarProps) => (
  <aside className="h-full border-b bg-white lg:w-[280px] xl:w-[300px] portrait:w-[280px]">
    <div className="relative portrait:px-4">
      <Button
        size="sm"
        isIconOnly
        onPress={toggleFn}
        className="group absolute right-0 top-[1px] rounded-e-none bg-white shadow-sm"
      >
        <Icon
          name="LeftChev"
          className="size-4 stroke-transparent text-primary-700 group-hover:text-macl-mint"
        />
      </Button>
      <section className="h-[calc(100vh-72px)] w-full space-y-2 overflow-y-scroll border-r bg-ghost p-2">
        <ListboxTitle title="Events" />
        <ListWrapper>
          <EventsList />
        </ListWrapper>
        <ListboxTitle title="Get-Aways" />
        <ListWrapper>
          <GetAwaysList />
        </ListWrapper>
      </section>
    </div>
  </aside>
);

const ListWrapper = ({ children }: { children: ReactNode }) => (
  <div className="bg-gradient-to-t from-ghost via-white to-ghost">
    <div className="h-2 bg-gradient-to-r from-ghost via-white to-ghost" />
    {children}
    <div className="h-2 bg-gradient-to-r from-ghost via-white to-ghost" />
  </div>
);

const ListboxTitle: FC<{ title: string }> = ({ title }) => (
  <div className="flex h-6 w-full items-center justify-between space-x-3 px-2">
    <p className="whitespace-nowrap text-[11px] font-semibold uppercase text-slate-500 drop-shadow-sm">
      {title}
    </p>
    {/* <div className="h-[0.33px] w-full bg-primary-100" /> */}
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
      "flex size-4 items-center justify-center rounded-full",
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
    <div className="bg-gradient-to-r from-ghost via-white to-ghost p-1">
      <HyperList
        data={events}
        component={EventItem}
        container="space-y-2"
        itemStyle="p-1.5 hover:bg-ghost"
        keyId="keyId"
      />
    </div>
  );
};

const GetAwayListItem = (l: Category) => (
  <div className="flex w-full items-center justify-between" key={l.keyId}>
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
    <div className="bg-gradient-to-r from-ghost via-white to-ghost p-1">
      <HyperList
        data={getaways}
        component={GetAwayItem}
        container="space-y-2"
        itemStyle="p-1.5 hover:bg-ghost rounded-lg"
        keyId="keyId"
      />
    </div>
  );
};

const EventListItem = (l: Category) => (
  <div className="flex w-full items-center justify-between" key={l.keyId}>
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
    color: "bg-ghost text-macl-teal",
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
    icon: "Airplane",
    count: 0,
    color: "bg-white text-macl-indigo",
  },
  {
    id: 1,
    keyId: "hotels",
    label: "Hotels",
    href: "",
    icon: "HotelRoom",
    count: 1,
    color: "bg-macl-blue/10 text-macl-gray",
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
