import type { CohostWithDefaults, CohostState, CohostAction } from "./types";

export const initialCohostState: CohostState = {
  cohostList: [],
  selectedCohost: undefined,
  isPending: false,
  isLoading: false,
};

export function cohostReducer(
  state: CohostState,
  action: CohostAction,
): CohostState {
  switch (action.type) {
    case "SET_COHOST_LIST":
      return {
        ...state,
        cohostList: action.payload,
        isLoading: false,
      };
    case "ADD_COHOST": {
      const newList = updateCohost([...state.cohostList], action.payload);
      return {
        ...state,
        cohostList: newList,
        isPending: false,
      };
    }
    case "UPDATE_COHOST": {
      const newList = state.cohostList.map((cohost) =>
        cohost.email === action.payload.email
          ? { ...cohost, ...action.payload, updated_at: Date.now() }
          : cohost,
      );
      return {
        ...state,
        cohostList: newList,
        isPending: false,
      };
    }
    case "REMOVE_COHOST":
      return {
        ...state,
        cohostList: state.cohostList.filter(
          (cohost) => !action.payload.includes(cohost.email),
        ),
        selectedCohost: undefined,
      };
    case "SELECT_COHOST":
      const updatedList = state.cohostList.map((cohost) => ({
        ...cohost,
        checked:
          cohost.email === action.payload.email
            ? action.payload.isSelected
            : cohost.checked,
      }));
      const checkedVIPs = updatedList.filter((cohost) => cohost.checked);
      return {
        ...state,
        cohostList: updatedList,
        selectedCohost: checkedVIPs.length === 1 ? checkedVIPs[0] : undefined,
      };
    case "SET_SELECTED_COHOST":
      return {
        ...state,
        selectedCohost: action.payload,
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
      return initialCohostState;
    default:
      return state;
  }
}

function updateCohost(
  cohost_list: CohostWithDefaults[],
  cohost: CohostWithDefaults,
) {
  const existingIndex = cohost_list.findIndex((v) => v.email === cohost.email);

  if (existingIndex !== -1) {
    // Update existing VIP
    cohost_list[existingIndex] = {
      ...cohost_list[existingIndex],
      ...cohost,
      updated_at: Date.now(),
    };
  } else {
    // Add new VIP
    cohost_list.push(cohost);
  }

  return cohost_list.filter((cohost) => cohost.status === "active");
}
