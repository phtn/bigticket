"use client";

import {
  createContext,
  useReducer,
  type Dispatch,
  type SetStateAction,
  useContext,
  type PropsWithChildren,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ActionDispatch,
} from "react";
import type {
  Attributes,
  CheckoutParams,
  LineItem,
} from "@/lib/paymongo/schema/zod.checkout";
import { useAuth } from "../ctx/auth/provider";
import { useCartStore } from "../(search)/@ev/components/buttons/cart/useCartStore";
import type { ItemProps, ReducerState } from "./types";
import { reducer, type ActionType } from "./reducer";
import { usePaymongo } from "@/hooks/usePaymongo";
import { useRouter, useSearchParams } from "next/navigation";
import { moses, secureRef } from "@/utils/crypto";
import { guid } from "@/utils/helpers";

const CART_STORAGE_KEY = "bigticket_cart";

interface OrderCtxValues {
  itemCount: number;
  itemList: LineItem[] | undefined;
  loading: boolean;
  state: ReducerState;
  dispatch: ActionDispatch<[action: ActionType]>;
  amount: number;
  checkoutSession: () => Promise<void>;
  updateCart: (list: ItemProps[]) => Promise<void>;
  params: CheckoutParams;
  orderNumber: string;
}

const initialState: ReducerState = {
  list: [],
  modified: false,
  history: [],
};

export const OrderCtx = createContext<OrderCtxValues | null>(null);

export const OrderProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<CheckoutParams>({} as CheckoutParams);
  const [productImage, setProductImage] = useState<string | null>(null);
  const { checkout } = usePaymongo();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { count, eventName, eventId, userId, total, setCount } = useCartStore();

  // Load product image
  useEffect(() => {
    if (eventId) {
      const v = localStorage.getItem(`cover_${eventId}`);
      const cachedImage = v ? (JSON.parse(v) as { cover_src: string }) : null;
      setProductImage(cachedImage?.cover_src ?? null);
    }
  }, [eventId]);

  // Get order number from URL or generate a new one
  const orderNumber = useMemo(() => {
    const urlRef = searchParams.get("r");
    if (urlRef) return urlRef;
    const refNo = moses(("b" + secureRef(8) + "t").toUpperCase());
    const params = new URLSearchParams(searchParams.toString());
    params.set("r", refNo);
    router.replace(`?${params.toString()}`);
    return refNo;
  }, [searchParams, router]);

  // Convert cart items to LineItems
  const cartItems = useMemo(
    () =>
      Array.from({ length: count }).map(
        () =>
          ({
            id: guid(),
            name: eventName,
            amount: total,
            description: userId,
            quantity: 1,
            currency: "PHP" as const,
            images: [productImage],
          }) as LineItem,
      ),
    [count, eventName, userId, total, productImage],
  );

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as ItemProps[];
        if (parsedCart.length > 0) {
          dispatch({ type: "SET", payload: parsedCart });
        }
      } catch (error) {
        console.error("Failed to parse saved cart:", error);
      }
    }
  }, []); // Only run on mount

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.list.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.list));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [state.list]);

  const descriptor = useMemo(
    () => String(user?.user_metadata?.name ?? user?.email),
    [user],
  );

  const itemCount = useMemo(
    () => state.list.reduce((acc, item) => acc + item.quantity, 0),
    [state.list],
  );

  const amount = useMemo(
    () => state.list.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [state.list],
  );

  const updateCart = useCallback(
    async (list: ItemProps[]) => {
      setLoading(true);
      try {
        dispatch({ type: "SET", payload: list });
        const lineItems = list.map((item) => ({
          name: item.name,
          amount: item.price,
          description: item.description ?? "",
          quantity: item.quantity,
          currency: "PHP" as const,
        }));
        setOrderParams(setParams, lineItems, orderNumber, descriptor);
      } finally {
        setLoading(false);
      }
    },
    [descriptor, orderNumber],
  );

  const checkoutSession = useCallback(async () => {
    setLoading(true);
    try {
      // Convert state items to PayMongo format
      const lineItems = state.list
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          name: item.name,
          amount: item.price,
          description: item.description ?? "",
          quantity: item.quantity,
          currency: "PHP" as const,
        }));

      if (lineItems.length === 0) {
        throw new Error("Cart is empty");
      }

      // Update checkout params
      setOrderParams(setParams, lineItems, orderNumber, descriptor);

      // Create PayMongo checkout session and redirect
      await checkout(params);

      // Only clear cart after successful checkout
      dispatch({ type: "SAVE" });
      setCount(0);
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Checkout failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [state.list, descriptor, setCount, checkout, params, orderNumber]);

  const value = useMemo(
    () => ({
      itemCount,
      itemList: cartItems,
      loading,
      state,
      dispatch,
      amount,
      checkoutSession,
      updateCart,
      params,
      orderNumber,
    }),
    [
      itemCount,
      cartItems,
      loading,
      state,
      dispatch,
      amount,
      checkoutSession,
      updateCart,
      params,
      orderNumber,
    ],
  );

  return <OrderCtx.Provider value={value}>{children}</OrderCtx.Provider>;
};

// PayMongo helper functions
const paymongoReady = (lineItems: LineItem[]): LineItem[] =>
  lineItems.map((item) => ({
    ...item,
    description: item.description.includes("--")
      ? item.description.substring(0, item.description.indexOf("--"))
      : item.description,
    amount: Math.round(item.amount * 100), // Convert to cents
  }));

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
        line_items: paymongoReady(lineItems),
        reference_number: refNumber,
        statement_descriptor: descriptor,
        description: `bigticket.ph`,
      },
    },
  });
};

export const attributes: Omit<
  Attributes,
  "line_items" | "description" | "reference_number" | "statement_descriptor"
> = {
  send_email_receipt: true,
  show_description: true,
  show_line_items: true,
  cancel_url: "https://re-up.ph",
  success_url: "https://re-up.ph",
  payment_method_types: ["gcash", "card", "grab_pay", "paymaya"],
};

export const useOrder = () => {
  const context = useContext(OrderCtx);
  if (!context) throw new Error("useOrder must be used within OrderProvider");
  return context;
};
