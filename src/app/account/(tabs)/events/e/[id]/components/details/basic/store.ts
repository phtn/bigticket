import { type SelectEvent, type BasicInfo } from "convex/events/d";
import { create } from "zustand";

interface FormStateBasic {
  event: SelectEvent | null;
  is_online: boolean;
  is_private: boolean;
  category: string | undefined;
  subcategory: string | undefined;
  start_date: number;
  end_date: number;
  event_name: string;
  event_desc: string;
  event_url: string;
  venue_name: string;
  venue_address: string;
  setEvent: (event: SelectEvent | null) => void;
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

export const useFormStateBasic = create<FormStateBasic>((set) => ({
  event: null,
  is_online: false,
  is_private: false,
  category: "party",
  subcategory: "nightlife",
  start_date: Date.now(),
  end_date: Date.now() + 36000000,
  event_name: "",
  event_desc: "",
  event_url: "",
  venue_name: "",
  venue_address: "",
  setEvent: (event: SelectEvent | null) => set({ event }),
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
