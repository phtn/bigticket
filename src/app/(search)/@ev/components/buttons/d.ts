export interface GetTicketProps {
  ticketPrice?: number;
  isPrivate?: boolean;
  isVip?: boolean;
  ticketCount?: number;
  h?: string;
  fn: VoidFunction;
}
