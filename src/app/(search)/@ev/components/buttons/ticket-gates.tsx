import type { UserTicket, VIP } from "convex/events/d";
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
  event_id: string | undefined,
  tickets: UserTicket[] | undefined,
) => {
  if (!isVIP) return false;
  return tickets?.findIndex((ticket) => ticket.event_id === event_id) === 1;
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
