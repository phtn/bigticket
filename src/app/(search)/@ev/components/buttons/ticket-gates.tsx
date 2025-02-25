import type { VIP } from "convex/events/d";
import type { ReactElement, ReactNode } from "react";

/// STATE CHECKS
export const IsVIP = (
  vipList: VIP[] | undefined,
  email: string | undefined,
) => {
  if (!vipList || !email) return false;
  return vipList.findIndex((vip) => vip.email === email) !== -1;
};

export const IsPrivateEvent = (isPrivate: boolean | undefined) => {
  if (!isPrivate) return false;
  return isPrivate;
};
export const HasClaimedTickets = (
  isVIP: boolean,
  vipList: VIP[] | undefined,
  email: string | undefined,
) => {
  if (!isVIP) return false;
  return vipList?.find((v) => v.email === email)?.tickets_claimed ?? false;
};

/// GATES

interface EventGate {
  check: boolean;
  fallback: ReactElement | null;
  children: ReactNode;
}
export const PrivateEventGate = ({ check, fallback, children }: EventGate) => {
  return check ? (fallback ?? null) : children;
};

export const VIPGate = ({ check, fallback, children }: EventGate) => {
  return check ? children : fallback;
};

export const ClaimedTicketsGate = ({
  check,
  fallback,
  children,
}: EventGate) => {
  return !check ? children : fallback;
};
