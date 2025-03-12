import type { LineItem } from "@/lib/paymongo/schema/zod.checkout";
import { guid } from "@/utils/helpers";
import type { ItemProps, ReducerState } from "./types";

const MAX_HISTORY = 10; // Limit history size to prevent unbounded growth

export type ActionType =
  | { type: "INCREMENT"; payload: { id: string } }
  | { type: "DECREMENT"; payload: { id: string } }
  | { type: "DELETE"; payload: { id: string } }
  | { type: "SET"; payload: ItemProps[] }
  | { type: "SAVE" }
  | { type: "CANCEL" }
  | { type: "UNDO" };

const addToHistory = (state: ReducerState): ReducerState[] => {
  const newHistory = [...state.history, state];
  return newHistory.slice(-MAX_HISTORY); // Keep only last N states
};

export const reducer = (
  state: ReducerState,
  action: ActionType,
): ReducerState => {
  switch (action.type) {
    case "CANCEL":
      const oldState = state.history[0];
      if (!oldState) return state;
      return {
        ...oldState,
        history: [oldState],
      };

    case "INCREMENT":
      const incrList = state.list.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      return {
        ...state,
        list: incrList,
        modified: true,
        history: addToHistory(state),
      };

    case "DECREMENT":
      const decrList = state.list.map((item) =>
        item.id === action.payload.id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
      return {
        ...state,
        list: decrList,
        modified: true,
        history: addToHistory(state),
      };

    case "DELETE":
      const filteredList = state.list.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: 0 } : item,
      );
      return {
        ...state,
        list: filteredList,
        modified: true,
        history: addToHistory(state),
      };

    case "SAVE":
      const nonZeroItems = state.list.filter((item) => item.quantity > 0);
      return {
        ...state,
        list: nonZeroItems,
        modified: false,
        history: [],
      };

    case "SET":
      return {
        ...state,
        list: action.payload,
        modified: false,
        history: [],
      };

    case "UNDO":
      const previousState = state.history[state.history.length - 1];
      if (!previousState) return state;
      return {
        ...previousState,
        history: state.history.slice(0, -1),
      };

    default:
      return state;
  }
};

export const createList = (list: LineItem[] | undefined): ItemProps[] => {
  if (!list) return [];
  return list.map((item) => ({
    id: guid(),
    name: item.name,
    image: item?.images?.[0] ?? null,
    description: item.description ?? null,
    price: +item.amount,
    amount: +item.amount * +item.quantity,
    quantity: +item.quantity,
  }));
};
