import { type XEvent } from "@/app/types";
import { type TicketInfo } from "convex/events/d";
import { create } from "zustand";

interface FormStateTicket {
  xEvent?: XEvent | null;
  ticket_count?: number;
  ticket_price?: number;
  min_age?: number;
  max_age?: number;
  ticket_sales_open: number;
  ticket_sales_close: number;
  ticket_sales_limit: number;
  ticket_sales_estimate: number;
  ticket_sales_email: string;
  ticket_sales_phone: string;
  setTicketCount: (ticket_count: number) => void;
  setTicketPrice: (ticket_price: number) => void;
  setMinAge: (min_age: number) => void;
  setMaxAge: (max_age: number) => void;
  setTicketSalesOpen: (ticket_sales_open: number) => void;
  setTicketSalesClose: (ticket_sales_close: number) => void;
  setTicketSalesLimit: (ticket_sales_limit: number) => void;
  setTicketSalesEstimate: (ticket_sales_estimate: number) => void;
  setTicketSalesEmail: (ticket_sales_email: string) => void;
  setTicketSalesPhone: (ticket_sales_phone: string) => void;
  setXEvent: (xEvent: XEvent | null) => void;
  reset: (ticketInfo: TicketInfo) => void;
}

export const useFormStateTicket = create<FormStateTicket>((set) => ({
  xEvent: null,
  ticket_count: 0,
  ticket_price: 0,
  min_age: 18,
  max_age: 42,
  ticket_sales_open: 0,
  ticket_sales_close: 0,
  ticket_sales_limit: 0,
  ticket_sales_estimate: 0,
  ticket_sales_email: "",
  ticket_sales_phone: "",
  setTicketCount: (ticket_count: number) => set({ ticket_count }),
  setTicketPrice: (ticket_price: number) => set({ ticket_price }),
  setMinAge: (min_age: number) => set({ min_age }),
  setMaxAge: (max_age: number) => set({ max_age }),
  setTicketSalesOpen: (ticket_sales_open: number) => set({ ticket_sales_open }),
  setTicketSalesClose: (ticket_sales_close: number) =>
    set({ ticket_sales_close }),
  setTicketSalesLimit: (ticket_sales_limit: number) =>
    set({ ticket_sales_limit }),
  setTicketSalesEstimate: (ticket_sales_estimate: number) =>
    set({ ticket_sales_estimate }),
  setTicketSalesEmail: (ticket_sales_email: string) =>
    set({ ticket_sales_email }),
  setTicketSalesPhone: (ticket_sales_phone: string) =>
    set({ ticket_sales_phone }),
  setXEvent: (xEvent: XEvent | null) => set({ xEvent }),
  reset: (ticketInfo: TicketInfo) => set(ticketInfo),
}));
