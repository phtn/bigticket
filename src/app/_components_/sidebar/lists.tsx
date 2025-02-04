import { useMemo } from "react";
import { type CategoryItem } from "./types";
import { SidebarList, SidebarListItem } from "./components";

export const EventsList = () => {
  const events: CategoryItem[] = useMemo(
    () => [
      {
        id: 0,
        keyId: "upcoming",
        label: "upcoming",
        href: "",
        icon: "Upcoming",
        count: 1,
        color: "bg- text-slate-800",
      },
      {
        id: 1,
        keyId: "nightlife",
        label: "Nightlife",
        href: "",
        icon: "Cocktail",
        count: 29,
        color: "bg-macl-indigo text-slate-800",
      },
      {
        id: 2,
        keyId: "concerts",
        label: "Concerts",
        href: "",
        icon: "EGuitarFender",
        count: 1,
        color: "bg-macl-mint text-slate-800",
      },
    ],
    [],
  );
  return (
    <SidebarList title="events" data={events} component={SidebarListItem} />
  );
};

export const GetAwaysList = () => {
  const getaways: CategoryItem[] = useMemo(
    () => [
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
    ],
    [],
  );
  return (
    <SidebarList
      title="get aways"
      data={getaways}
      component={SidebarListItem}
    />
  );
};

export const ShopsList = () => {
  const shops: CategoryItem[] = useMemo(
    () => [
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
    ],
    [],
  );
  return <SidebarList title="shops" data={shops} component={SidebarListItem} />;
};
