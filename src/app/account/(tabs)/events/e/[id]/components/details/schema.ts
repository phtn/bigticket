import { type InputProps } from "@nextui-org/react";
import type { Cohost, EventGallery, InsertEvent, VIP } from "convex/events/d";
import type { ReactNode } from "react";
import { z } from "zod";
import { type EventDetailKey } from "./ctx";

export type FieldData = string | number | boolean | undefined;
export interface EventDetailField {
  children: ReactNode;
  render: (option: EventDetailKey | null) => ReactNode;
  data: FieldData[];
}
export type EventFieldName = keyof Partial<InsertEvent>;
export type EventField = InputProps & {
  name: EventDetailKey;
};
export interface VIPField extends InputProps {
  name: keyof VIP;
}
export interface CohostField extends InputProps {
  name: keyof Cohost;
}
export interface MediaField extends InputProps {
  name: keyof EventGallery;
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

export const VIPZod = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email().max(100),
  ticket_count: z.number().max(100),
});
export const vip_info: VIPField[] = [
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

export const MediaZod = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(100).optional(),
  src: z.string().min(1).max(100).optional(),
  alt: z.string().min(1).max(100).optional(),
});
export const media_fields: MediaField[] = [
  {
    name: "title",
    type: "text",
    label: "Title",
    placeholder: "Title of the video or image",
    required: false,
  },
  {
    name: "description",
    type: "text",
    label: "Description",
    placeholder: "Short description of the video or image",
    required: false,
  },
  {
    name: "src",
    type: "text",
    label: "Media Source or ID",
    placeholder: "URL or YouTubeID",
    required: true,
  },
  {
    name: "alt",
    type: "text",
    label: "Alt",
    placeholder: "Alternative text for the media",
    required: true,
  },
];

export const cohost_info: CohostField[] = [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Name of the co-host",
    required: false,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Email receiving the invitation",
    required: true,
  },
];
export const CohostZod = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email().max(100),
});
