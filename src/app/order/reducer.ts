import type { LineItem } from "@/lib/paymongo/schema/zod.checkout";
import { type ItemProps } from "./ctx";

export interface ReducerState {
  list: ItemProps[];
  modified: boolean;
  history: ReducerState[];
}

type ActionType =
  | { type: "INCREMENT"; payload: { name: string | undefined } }
  | { type: "DECREMENT"; payload: { name: string | undefined } }
  | { type: "DELETE"; payload: { name: string | undefined } }
  | { type: "SET"; payload: ItemProps[] }
  | { type: "SAVE" }
  | { type: "CANCEL" }
  | { type: "UNDO" };

export const reducer = (
  state: ReducerState,
  action: ActionType,
): ReducerState => {
  switch (action.type) {
    case "CANCEL":
      const oldState = state.history[0];
      return {
        ...oldState!,
        history: [oldState!],
      };
    case "INCREMENT":
      const incrList = state.list.map((item) =>
        item.name === action.payload.name
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      return {
        ...state,
        list: incrList,
        modified: true,
        history: [...state.history, state],
      };
    case "DECREMENT":
      const decrList = state.list.map((item) =>
        item.name === action.payload.name && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
      return {
        ...state,
        history: [...state.history, state],
        list: decrList,
        modified: true,
      };
    case "DELETE":
      const filteredList = state.list.map((item) =>
        item.name === action.payload.name ? { ...item, quantity: 0 } : item,
      );
      return {
        ...state,
        history: [...state.history, state],
        list: filteredList,
        modified: true,
      };
    case "SAVE":
      // const filterNull = state.list.filter((item) => item.quantity !== 0);
      return {
        ...state,
        // list: filterNull,
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
      return {
        ...previousState!,
        history: state.history.slice(0, -1),
      };
    default:
      return state;
  }
};

export const createList = (list: LineItem[] | undefined) =>
  list?.map(
    (item) =>
      ({
        name: item.name,
        image: item.name,
        description: item.description,
        price: +item.amount,
        amount: item.amount,
        quantity: item.quantity,
      }) as ItemProps,
  );
