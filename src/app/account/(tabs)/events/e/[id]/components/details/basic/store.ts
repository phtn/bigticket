import { type BasicInfo } from "convex/events/d";
import { create } from "zustand";

interface FormStateEvent {
  is_online?: boolean;
  is_private?: boolean;
  category: string;
  subcategory: string;
  start_date: number;
  end_date: number;
  event_name: string;
  event_desc: string;
  event_url: string;
  venue_name: string;
  venue_address: string;
  setIsOnline: (is_online: boolean) => void;
  setIsPrivate: (is_private: boolean) => void;
  setCategory: (category: string) => void;
  setSubcategory: (category: string) => void;
  setStartDate: (start_date: number) => void;
  setEndDate: (end_date: number) => void;
  setEventName: (event_name: string) => void;
  setEventDesc: (event_desc: string) => void;
  setEventUrl: (event_url: string) => void;
  setVenueName: (venue_name: string) => void;
  setVenueAddress: (venue_address: string) => void;
  reset: (basicInfo: BasicInfo) => void;
}

export const useFormStateEvent = create<FormStateEvent>((set) => ({
  is_online: false,
  is_private: false,
  category: "party",
  subcategory: "nightlife",
  start_date: 0,
  end_date: 0,
  event_name: "",
  event_desc: "",
  event_url: "",
  venue_name: "",
  venue_address: "",
  setIsOnline: (is_online: boolean) => set({ is_online }),
  setIsPrivate: (is_private: boolean) => set({ is_private }),
  setCategory: (category: string) => set({ category }),
  setSubcategory: (subcategory: string) => set({ subcategory }),
  setStartDate: (start_date: number) => set({ start_date }),
  setEndDate: (end_date: number) => set({ end_date }),
  setEventName: (event_name: string) => set({ event_name }),
  setEventDesc: (event_desc: string) => set({ event_desc }),
  setEventUrl: (event_url: string) => set({ event_url }),
  setVenueName: (venue_name: string) => set({ venue_name }),
  setVenueAddress: (venue_address: string) => set({ venue_address }),

  reset: (basicInfo: BasicInfo) => set(basicInfo),
}));
