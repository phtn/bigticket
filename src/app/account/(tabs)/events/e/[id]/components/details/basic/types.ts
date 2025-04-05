import { type EventField } from "../schema";

export interface BasicContentProps {
  event_id?: string;
  pending: boolean;
}

export interface FieldBlockProps {
  data: EventField[];
  pending: boolean;
}
