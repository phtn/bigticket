import type { InsertEvent, VIP } from "convex/events/d";
import type { HTMLInputTypeAttribute } from "react";
import { z } from "zod";

export interface EventField<T> {
  name: keyof T;
  type: HTMLInputTypeAttribute;
  label: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: string;
  inputMode?: string;
}

export const basic_info: EventField<InsertEvent>[] = [
  {
    name: "event_name",
    type: "text",
    label: "Event name",
    placeholder: "The name of the event",
    required: true,
  },
  {
    name: "event_desc",
    type: "text",
    label: "Describe what your event is about.",
    placeholder: "Provide a brief description of your event.",
    required: false,
  },
  {
    name: "category",
    type: "text",
    label: "Event Category",
    placeholder: "Select a category that fits your event.",
    required: false,
  },
];

export const ticket_info: EventField<InsertEvent>[] = [
  {
    name: "ticket_value",
    type: "number",
    label: "Ticket value",
    placeholder: "Value of each ticket.",
    required: false,
  },
  {
    name: "ticket_count",
    type: "number",
    label: "Ticket count",
    placeholder: "Number of tickets available.",
    required: false,
  },
  {
    name: "ticket_count_limit",
    type: "number",
    label: "Ticket count limit",
    placeholder: "Maximum number of tickets allowed.",
    required: true,
  },
];

export const guest_info: EventField<InsertEvent>[] = [
  {
    name: "is_private",
    type: "text",
    label: "Access",
    placeholder: "Access",
    required: true,
  },
];

export const support_info: EventField<InsertEvent>[] = [
  {
    name: "event_email",
    type: "email",
    label: "Event email",
    placeholder: "Email address of the event communications.",
    required: false,
  },
  {
    name: "event_phone",
    type: "text",
    label: "Event phone",
    placeholder: "Phone number of the event communications.",
    required: false,
  },
];

export const event_fields: EventField<InsertEvent>[] = [
  {
    name: "event_type",
    type: "text",
    label: "Event type",
    placeholder: "",
    required: true,
  },
  {
    name: "host_id",
    type: "text",
    label: "Host ID",
    placeholder: "Host ID",
    required: true,
  },
  {
    name: "host_name",
    type: "text",
    label: "Host Name",
    placeholder: "The name of the host organizing the event.",
    required: false,
  },
];

export const vip_info: EventField<VIP>[] = [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Name of the VIP",
    required: false,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Email receiving the invitation",
    required: true,
  },
  {
    name: "ticket_count",
    type: "text",
    label: "Number of Tickets",
    placeholder: "Number of tickets for the VIP",
    required: true,
    defaultValue: "1",
    inputMode: "numeric",
  },
];

export const VIPZod = z.object({
  name: z.string().max(100),
  email: z.string().email().max(100),
  ticket_count: z.number().max(100),
});
