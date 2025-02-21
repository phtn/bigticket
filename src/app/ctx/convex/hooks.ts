import { useQuery } from "convex/react";
import { api } from "@vx/api";

export const useEventAll = () => {
  return useQuery(api.events.get.all);
};
export const useEventById = (id: string) => {
  return useQuery(api.events.get.byId, { id }) ?? null;
};

export const useEventsByIds = (ids: string[]) => {
  return useQuery(api.events.get.byIds, { ids });
};

export const useEventsByHostId = (host_id: string) => {
  return useQuery(api.events.get.byHostId, { host_id });
};
