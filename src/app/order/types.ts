export interface ItemProps {
  id: string;
  image: string | null;
  name: string;
  description: string;
  price: number;
  amount: number;
  quantity: number;
}

export interface Fn {
  deleteFn: (id: string) => void;
  cancelFn: VoidFunction;
  incrementFn: (id: string) => void;
  decrementFn: (id: string) => void;
  saveFn: () => Promise<void>;
  undoFn: VoidFunction;
}

export interface ListItemProps extends ItemProps {
  fn: Fn;
}

export interface CartItemProps {
  item: ItemProps | undefined;
  quantity: number;
  fn: Fn;
}

export interface TicketDetail {
  venue: string | undefined;
  date: string | undefined;
  org: string | undefined;
}

export interface ProductImageProps {
  alt: string | null;
  src: string | null;
  quantity: number | null;
}

export interface HeaderProps {
  itemCount: number | null;
  total: number | null;
}

export interface StatProps {
  label: string;
  value: number | string | null;
  dark?: boolean;
  special?: boolean;
}

export interface ReducerState {
  list: ItemProps[];
  modified: boolean;
  history: ReducerState[];
}
export interface UserDetails {
  userName: string | undefined;
  userEmail: string | undefined;
  userPhone: string | undefined;
}
export interface SummaryProps {
  refNumber: string | null;
  state: ReducerState;
  updated: number | undefined;
  checkoutFn: VoidFunction;
  loading: boolean;
  userDetails: UserDetails;
}

export interface Calc {
  label: string;
  value: number;
}

export interface SummaryContentProps {
  state: ReducerState;
  refNumber: string | null;
  paymongoCheckout: VoidFunction;
  loading: boolean;
  userDetails: UserDetails;
}
