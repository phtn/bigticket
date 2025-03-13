import type { XEvent } from "@/app/types";
import type { EventGallery } from "convex/events/d";

export type MediaAction =
  | { type: "ADD_MEDIA"; payload: EventGallery }
  | { type: "REMOVE_MEDIA"; payload: number }
  | { type: "SET_MEDIA"; payload: EventGallery[] };

export interface MediaContentProps {
  xEvent: XEvent | null;
  user_id: string | undefined;
}

export interface MediaListProps {
  data: EventGallery[];
}

export interface MediaFormState {
  title: string;
  description: string;
  src: string;
  alt: string;
} 