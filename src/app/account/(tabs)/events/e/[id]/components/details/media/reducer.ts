import type { EventGallery } from "convex/events/d";
import type { MediaAction } from "./types";

export const mediaReducer = (
  state: EventGallery[],
  action: MediaAction,
): EventGallery[] => {
  switch (action.type) {
    case "ADD_MEDIA":
      return [...state, action.payload];
    case "REMOVE_MEDIA":
      return state.filter((_, index) => index !== action.payload);
    case "SET_MEDIA":
      return action.payload;
    default:
      return state;
  }
}; 