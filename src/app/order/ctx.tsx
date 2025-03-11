"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  type PropsWithChildren,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import type {
  Attributes,
  CheckoutParams,
  LineItem,
} from "@/lib/paymongo/schema/zod.checkout";
import { useAuth } from "../ctx/auth/provider";
import { useCartStore } from "../(search)/@ev/components/buttons/cart/useCartStore";

interface OrderCtxValues {
  itemCount: number;
  itemList: LineItem[] | undefined;
  loading: boolean;
  setItemCount: Dispatch<SetStateAction<number>>;
  setAmount: Dispatch<SetStateAction<number>>;
  deleteItem: (name: string) => Promise<void>;
  amount: number | undefined;
  updateCart: (list: ItemProps[]) => Promise<void>;
  params: CheckoutParams;
}
export const OrderCtx = createContext<OrderCtxValues | null>(null);
export const OrderProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();

  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [itemList, setItemList] = useState<LineItem[] | undefined>();
  // const [updated, setUpdated] = useState<number>();
  const [params, setParams] = useState<CheckoutParams>({} as CheckoutParams);

  const { count, eventName, userId, total } = useCartStore();

  const items = Array.from({ length: count }).map(
    (i) =>
      ({
        id: i,
        name: eventName,
        amount: total,
        description: userId,
      }) as LineItem & { id: number },
  );

  useEffect(() => {
    setItemList(items);
  }, [items]);

  const descriptor = String(user?.user_metadata?.name ?? user?.email);

  const deleteItem = useCallback(
    async (name: string) => {
      setLoading(true);
      const newItems = deleteCartItem([], name);
      setOrderParams(setParams, newItems, "", descriptor);
    },
    [descriptor],
  );

  const updateCart = useCallback(
    async (list: ItemProps[]) => {
      setLoading(true);
      const newItems = createLineItems(list);
      setOrderParams(setParams, newItems, "", descriptor);
    },
    [descriptor],
  );

  const value = useMemo(
    () => ({
      itemCount,
      itemList,
      loading,
      amount,
      deleteItem,
      setAmount,
      setItemCount,
      updateCart,
      params,
    }),
    [
      itemCount,
      itemList,
      loading,
      amount,
      deleteItem,
      setAmount,
      setItemCount,
      updateCart,
      params,
    ],
  );

  return <OrderCtx.Provider value={value}>{children}</OrderCtx.Provider>;
};

export const getCount = (items: LineItem[] | undefined) =>
  items?.reduce((acc, cur) => {
    return acc + cur.quantity;
  }, 0);

export const getTotalAmount = (lineItems: LineItem[] | undefined): number =>
  lineItems?.reduce((total, item) => total + item.amount, 0) ?? 0;

const deleteCartItem = (
  lineItems: LineItem[] | undefined,
  name: string,
): LineItem[] => lineItems?.filter((item) => item.name !== name) ?? [];

const createLineItems = (list: Omit<ItemProps, "image" | "price">[]) =>
  list.map((item) => ({ ...item, currency: "PHP" }) as LineItem);

// const createLineItem = (item: Omit<ItemProps, "image" | "price">) =>
//   ({ ...item, currency: "PHP" }) as LineItem;

const paymongoReady = (lineItems: LineItem[] | undefined) =>
  lineItems?.map(
    (item) =>
      ({
        ...item,
        description: item.description.substring(
          0,
          item.description.indexOf("--"),
        ),
        amount: item.amount * 100,
      }) as LineItem,
  );

const setOrderParams = (
  setState: Dispatch<SetStateAction<CheckoutParams>>,
  lineItems: LineItem[],
  refNumber: string | undefined,
  descriptor: string,
) => {
  setState({
    data: {
      attributes: {
        ...attributes,
        line_items: paymongoReady(lineItems)!,
        reference_number: refNumber,
        statement_descriptor: descriptor,
        description: `Oh My Skin! Skin Care`,
      },
    },
  });
};

export const attributes: Omit<
  Attributes,
  "line_items" | "description" | "reference_number" | "statement_descriptor"
> = {
  send_email_receipt: false,
  show_description: true,
  show_line_items: true,
  cancel_url: "https://re-up.ph",
  success_url: "https://re-up.ph",
  payment_method_types: [
    "gcash",
    "card",
    // "brankas_bdo",
    // "dob_ubp",
    // "brankas_landbank",
    // "brankas_metrobank",
    "grab_pay",
    "paymaya",
    // "dob",
  ],
};

export function upsertLineItem(
  array: LineItem[],
  name: string | undefined,
  updates: Partial<LineItem>,
): LineItem[] | null {
  const index = array.findIndex((item) => item.name === name);

  if (index === -1) {
    console.log(`Object with id ${name} not found. Appending new object.`);
    return [...array, { name, ...updates } as LineItem];
  }

  const currentObject = array[index];
  const hasChanges = Object.keys(updates).some(
    (key) =>
      updates[key as keyof LineItem] !== currentObject?.[key as keyof LineItem],
  );

  if (!hasChanges) {
    console.log(`No changes detected for object with id ${name}`);
    return null;
  }

  const updatedObject = { ...currentObject, ...updates };
  return [
    ...array.slice(0, index),
    updatedObject,
    ...array.slice(index + 1),
  ] as LineItem[];
}

export function collectLineItems(
  existingItems: LineItem[],
  newItem: LineItem,
): LineItem[] {
  // Create a flag to check if the item was found
  let itemFound = false;

  // Loop through existing line items
  const updatedItems = existingItems.map((item) => {
    if (item.name === newItem.name) {
      // If a match is found, update the quantity and amount
      itemFound = true;
      const updatedQuantity = item.quantity + newItem.quantity;
      const updatedAmount = updatedQuantity * item.amount; // Recalculate amount
      return { ...item, quantity: updatedQuantity, amount: updatedAmount };
    }
    return item; // Return the item unchanged if no match
  });

  // If no match was found, append the new item
  if (!itemFound) {
    updatedItems.push({
      ...newItem,
      amount: newItem.quantity * newItem.amount, // Calculate the amount for the new item
    });
  }

  return updatedItems;
}

export interface ItemProps {
  image: string | null;
  name: string;
  description: string | null;
  price: number;
  amount: number;
  quantity: number;
}
export const useOrder = () => {
  const context = useContext(OrderCtx);
  if (!context) throw new Error();
  return context;
};
