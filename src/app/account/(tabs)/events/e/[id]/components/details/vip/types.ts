import type { XEvent } from "@/app/types";
import type { IconName } from "@/icons";
import type { VIPField } from "../schema";

export type VIPState = {
  vipList: VIPWithDefaults[];
  selectedVIP: VIPWithDefaults | undefined;
  isPending: boolean;
  isLoading: boolean;
};

export interface VIPBase {
  name?: string;
  email: string;
  ticket_count: number;
}

export interface VIPWithDefaults extends VIPBase {
  idx?: number;
  checked?: boolean;
  invitation_sent: boolean;
  tickets_claimed?: boolean;
  tickets_used?: number;
  created_by?: string | null;
  event_id?: string | undefined;
  event_name?: string | undefined;
  updated_at?: number;
}

export type VIPUpdate = Partial<Omit<VIPWithDefaults, keyof VIPBase>> & VIPBase;

export type VIPAction =
  | { type: "SET_VIP_LIST"; payload: VIPWithDefaults[] }
  | { type: "ADD_VIP"; payload: VIPWithDefaults }
  | { type: "UPDATE_VIP"; payload: VIPWithDefaults }
  | { type: "REMOVE_VIP"; payload: string[] } // array of emails
  | { type: "SELECT_VIP"; payload: { email: string; isSelected: boolean } }
  | { type: "SET_SELECTED_VIP"; payload: VIPWithDefaults | undefined }
  | { type: "SET_PENDING"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" };

export interface VIPBlockProps {
  data: VIPField[];
  label: string;
  icon: IconName;
  delay?: number;
  editMode?: boolean;
}
export interface VIPContentProps {
  xEvent: XEvent | null;
  user_id: string | null;
  event_id: string | undefined;
}
