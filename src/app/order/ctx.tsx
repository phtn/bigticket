"use client";

import { usePaymongo } from "@/hooks/usePaymongo";
import type {
  Attributes,
  CheckoutParams,
  LineItem,
} from "@/lib/paymongo/schema/zod.checkout";
import { moses, secureRef } from "@/utils/crypto";
import { guid } from "@/utils/helpers";
import { useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ActionDispatch,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useCartStore } from "../(search)/@ev/components/buttons/cart/useCartStore";
import { useAuth } from "../ctx/auth/provider";
import { reducer, type ActionType } from "./reducer";
import type { ItemProps, ReducerState } from "./types";

const CART_STORAGE_KEY = "bigticket_cart";

interface OrderCtxValues {
  itemCount: number;
  itemList: LineItem[] | undefined;
  loading: boolean;
  state: ReducerState;
  dispatch: ActionDispatch<[action: ActionType]>;
  amount: number;
  createCheckoutSession: () => Promise<void>;
  updateCart: (list: ItemProps[]) => Promise<void>;
  params: CheckoutParams;
  orderNumber: string;
  lastUpdate: number;
}

const initialState: ReducerState = {
  list: [],
  modified: false,
  history: [],
};

export const OrderCtx = createContext<OrderCtxValues | null>(null);

interface OrderProviderProps {
  children: React.ReactNode;
  node_env: boolean;
}

export const OrderProvider = ({ children, node_env }: OrderProviderProps) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<CheckoutParams>({} as CheckoutParams);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [productImage, setProductImage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { checkout } = usePaymongo();

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
    // const params = new URLSearchParams(searchParams.toString());
    // params.set("r", refNo);
    // router.replace(`?${params.toString()}`);
    return refNo;
  }, [searchParams]);

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
      setLastUpdate(Date.now());
      try {
        const parsedCart = JSON.parse(savedCart) as ItemProps[];
        if (parsedCart.length > 0) {
          dispatch({ type: "SET", payload: parsedCart });
        }
      } catch (error) {
        console.error("Failed to parse saved cart:", error);
      }
    }
  }, []);

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

  const createCheckoutSession = useCallback(async () => {
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

      // Create checkout parameters
      const checkoutParams: CheckoutParams = {
        data: {
          attributes: {
            ...attributes,
            line_items: paymongoReady(lineItems),
            reference_number: orderNumber,
            statement_descriptor: descriptor,
            description: orderNumber,
            billing: {
              name: user?.user_metadata?.full_name as string,
              email: user?.email,
              phone: user?.user_metadata?.phone as string,
              address: {
                line1: "",
                line2: user?.user_metadata?.address as string,
                city: "",
                state: "",
                postal_code: "",
                country: "PH",
              },
            },
            cancel_url: node_env
              ? "https://bigticket.ph/payments/cancelled"
              : "http://localhost:3000/payments/cancelled",
            success_url: node_env
              ? "https://bigticket.ph/payments/success"
              : "http://localhost:3000/payments/success",
          },
        },
      };

      // Update state and proceed with checkout
      setParams(checkoutParams);
      await checkout(checkoutParams);

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
  }, [
    state.list,
    descriptor,
    setCount,
    checkout,
    orderNumber,
    dispatch,
    user,
    node_env,
  ]);

  const value = useMemo(
    () => ({
      itemCount,
      itemList: cartItems,
      loading,
      state,
      dispatch,
      amount,
      createCheckoutSession,
      updateCart,
      params,
      orderNumber,
      lastUpdate,
    }),
    [
      itemCount,
      cartItems,
      loading,
      state,
      dispatch,
      amount,
      createCheckoutSession,
      updateCart,
      params,
      orderNumber,
      lastUpdate,
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

const attributes: Omit<
  Attributes,
  "line_items" | "description" | "reference_number" | "statement_descriptor"
> = {
  send_email_receipt: true,
  show_description: true,
  show_line_items: true,
  payment_method_types: [
    "gcash",
    "card",
    "grab_pay",
    "paymaya",
    "dob_ubp",
    "brankas_bdo",
    "brankas_metrobank",
    "brankas_landbank",
  ],
};

export const useOrder = () => {
  const context = useContext(OrderCtx);
  if (!context) throw new Error("useOrder must be used within OrderProvider");
  return context;
};
