import type { CohostClearance } from "convex/events/d";
import type { CohostField } from "../schema";
import type { IconName } from "@/icons";
import type { XEvent } from "@/app/types";

export interface CohostBlockProps {
  data: CohostField[];
  label: string;
  icon: IconName;
  delay?: number;
}
export interface CohostContentProps {
  xEvent: XEvent | null;
  user_id: string | undefined;
}
export type CohostState = {
  cohostList: CohostWithDefaults[];
  selectedCohost: CohostWithDefaults | undefined;
  isPending: boolean;
  isLoading: boolean;
};
export interface CohostWithDefaults extends CohostBase {
  idx?: number;
  email: string;
  name?: string;
  event_id?: string;
  event_name?: string;
  created_by?: string | null;
  host_name?: string;
  updated_at?: number;
  clearance?: CohostClearance;
  checked?: boolean;
  invitation_sent?: boolean;
}
export interface CohostBase {
  name?: string;
  email: string;
}

export type CohostUpdate = Partial<Omit<CohostWithDefaults, keyof CohostBase>> &
  CohostBase;

export type CohostAction =
  | { type: "SET_COHOST_LIST"; payload: CohostWithDefaults[] }
  | { type: "ADD_COHOST"; payload: CohostWithDefaults }
  | { type: "UPDATE_COHOST"; payload: CohostWithDefaults }
  | { type: "REMOVE_COHOST"; payload: string[] } // array of emails
  | { type: "SELECT_COHOST"; payload: { email: string; isSelected: boolean } }
  | { type: "SET_SELECTED_COHOST"; payload: CohostWithDefaults | undefined }
  | { type: "SET_PENDING"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" };
