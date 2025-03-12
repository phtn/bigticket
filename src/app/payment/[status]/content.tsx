"use client";

export type PaymentStatus = "success" | "failed" | "pending";
interface ContentProps {
  status: PaymentStatus;
}

export const Content = ({ status }: ContentProps) => {
  return <main>Content = {status}</main>;
};
