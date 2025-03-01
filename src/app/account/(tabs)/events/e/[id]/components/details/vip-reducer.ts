import { type VIPWithState } from "./vip";

export type VIPState = {
  vipList: VIPWithState[];
  selectedVIP: VIPWithState | undefined;
  isPending: boolean;
  isLoading: boolean;
};

export type VIPAction =
  | { type: "SET_VIP_LIST"; payload: VIPWithState[] }
  | { type: "ADD_VIP"; payload: VIPWithState }
  | { type: "UPDATE_VIP"; payload: VIPWithState }
  | { type: "REMOVE_VIP"; payload: string[] } // array of emails
  | { type: "SELECT_VIP"; payload: { email: string; isSelected: boolean } }
  | { type: "SET_SELECTED_VIP"; payload: VIPWithState | undefined }
  | { type: "SET_PENDING"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" };

export const initialVIPState: VIPState = {
  vipList: [],
  selectedVIP: undefined,
  isPending: false,
  isLoading: false,
};

export function vipReducer(state: VIPState, action: VIPAction): VIPState {
  switch (action.type) {
    case "SET_VIP_LIST":
      return {
        ...state,
        vipList: action.payload,
      };
    case "ADD_VIP":
      return {
        ...state,
        vipList: updateVIP([...state.vipList], action.payload),
      };
    case "UPDATE_VIP":
      return {
        ...state,
        vipList: state.vipList.map((vip) =>
          vip.email === action.payload.email ? action.payload : vip,
        ),
      };
    case "REMOVE_VIP":
      return {
        ...state,
        vipList: state.vipList.filter(
          (vip) => !action.payload.includes(vip.email),
        ),
        selectedVIP: undefined,
      };
    case "SELECT_VIP":
      const updatedList = state.vipList.map((vip) => ({
        ...vip,
        checked:
          vip.email === action.payload.email
            ? action.payload.isSelected
            : vip.checked,
      }));
      const checkedVIPs = updatedList.filter((vip) => vip.checked);
      return {
        ...state,
        vipList: updatedList,
        selectedVIP: checkedVIPs.length === 1 ? checkedVIPs[0] : undefined,
      };
    case "SET_SELECTED_VIP":
      return {
        ...state,
        selectedVIP: action.payload,
      };
    case "SET_PENDING":
      return {
        ...state,
        isPending: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "RESET":
      return initialVIPState;
    default:
      return state;
  }
}

function updateVIP(vip_list: VIPWithState[], vip: VIPWithState) {
  const map = new Map();
  vip_list.forEach((c, index) => map.set(c.email, index));

  const existingIndex = map.get(vip.email) as number;
  if (existingIndex !== undefined) {
    vip_list[existingIndex]!.ticket_count = vip.ticket_count;
  } else {
    vip_list.push(vip);
  }
  return vip_list.filter((vip) => vip.ticket_count !== 0);
}
