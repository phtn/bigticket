import { type InputProps } from "@nextui-org/react";
import type { InsertEvent } from "convex/events/d";
import type { HTMLInputTypeAttribute } from "react";
import { z } from "zod";
import { type EventDetailKey } from "./ctx";

export type EventFieldValue = string | number | boolean | undefined;
export type EventFieldName = keyof Partial<InsertEvent>;
export type EventField = InputProps & {
  name: EventDetailKey;
};

export interface EventF {
  name: keyof InsertEvent;
  type: HTMLInputTypeAttribute;
  label: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: string;
  inputMode?: string;
}

export const ticket_info: EventField[] = [
  {
    name: "ticket_price",
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
];

export const access_info: EventField[] = [
  {
    name: "is_private",
    type: "text",
    label: "Access",
    placeholder: "Access",
    required: true,
  },
];

export const support_info: EventField[] = [
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

export const event_fields: EventField[] = [
  {
    name: "event_type",
    type: "text",
    label: "Event type",
    placeholder: "",
    required: true,
  },
];

export const vip_info: InputProps[] = [
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
