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
  deleteFn: (name: string) => void;
  cancelFn: VoidFunction;
  incrementFn: (name: string) => void;
  decrementFn: (name: string) => void;
  saveFn: () => Promise<void>;
  undoFn: VoidFunction;
}

export interface ListItemProps extends ItemProps {
  fn: Fn;
}

export interface ProductImageProps {
  alt: string | null;
  src: string | null;
  quantity: number | null;
}

export interface HeaderProps {
  itemCount: number | null;
  amount: string;
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

export interface SummaryProps {
  refNumber: string | null;
  state: ReducerState;
  updated: number | undefined;
  checkoutFn: VoidFunction;
  loading: boolean;
}

export interface Calc {
  label: string;
  value: number;
}

export interface SummaryContentProps {
  state: ReducerState;
  paymongoCheckout: VoidFunction;
  loading: boolean;
}
