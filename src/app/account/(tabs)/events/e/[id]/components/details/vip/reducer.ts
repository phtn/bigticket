import type { VIPWithDefaults, VIPState, VIPAction } from "./types";

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
        isLoading: false,
      };
    case "ADD_VIP": {
      const newList = updateVIP([...state.vipList], action.payload);
      return {
        ...state,
        vipList: newList,
        isPending: false,
      };
    }
    case "UPDATE_VIP": {
      const newList = state.vipList.map((vip) =>
        vip.email === action.payload.email
          ? { ...vip, ...action.payload, updated_at: Date.now() }
          : vip
      );
      return {
        ...state,
        vipList: newList,
        isPending: false,
      };
    }
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

function updateVIP(vip_list: VIPWithDefaults[], vip: VIPWithDefaults) {
  const existingIndex = vip_list.findIndex((v) => v.email === vip.email);

  if (existingIndex !== -1) {
    // Update existing VIP
    vip_list[existingIndex] = {
      ...vip_list[existingIndex],
      ...vip,
      updated_at: Date.now(),
    };
  } else {
    // Add new VIP
    vip_list.push(vip);
  }

  return vip_list.filter((vip) => vip.ticket_count !== 0);
}
