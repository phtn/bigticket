import { create } from "zustand";

interface OrderDetails {
  code: string | undefined;
  refNo: string;
}
interface UserDetails {
  userId: string;
  userName: string;
  userEmail: string | undefined;
  userPhone: string | undefined;
  userAddress: string | undefined;
}
interface EventDetails {
  eventId: string | undefined;
  eventName: string | undefined;
  eventDate: number | undefined;
  eventVenue: string | undefined;
  eventAddress: string | undefined;
  eventOrganizer: string | undefined;
}

interface CartStore extends OrderDetails, UserDetails, EventDetails {
  count: number;
  price: number | undefined;
  total: number;
  setCount: (ticketCount: number) => void;
  setPrice: (ticketPrice: number) => void;
  setTotal: (totalAmount: number) => void;
  setEventDetails: (details: EventDetails) => void;
  setOrderDetails: (details: OrderDetails) => void;
  setUserDetails: (details: UserDetails) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  code: undefined,
  refNo: "",
  count: 0,
  price: 0,
  total: 0,
  userId: "",
  userName: "",
  userEmail: "",
  userPhone: "",
  userAddress: "",
  eventId: "",
  eventName: "",
  eventDate: 0,
  eventVenue: "",
  eventAddress: "",
  eventOrganizer: "",
  setCount: (count: number) => set({ count }),
  setPrice: (price: number) => set({ price }),
  setTotal: (total: number) => set({ total }),
  setOrderDetails: (details: OrderDetails) => set({ ...details }),
  setUserDetails: (details: UserDetails) => set({ ...details }),
  setEventDetails: (details: EventDetails) => set({ ...details }),
}));
