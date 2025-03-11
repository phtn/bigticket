"use client";

import { EventViewer } from "@/app/(search)/@ev/viewer";
import { CartCtxProvider } from "./components/buttons/cart/ctx";

export const EVContent = () => {
  return (
    <CartCtxProvider>
      <EventViewer />
    </CartCtxProvider>
  );
};
