import { api } from "@vx/api";
import { useConvexUtils } from "./useConvexUtils";
import { useMutation } from "convex/react";

export const useVxEvents = () => {
  const { useQry } = useConvexUtils();

  const mut = {
    create: useMutation(api.events.create.default),
    updateEventVIP: useMutation(api.events.update.vip),
    updateEventViews: useMutation(api.events.update.views),
    updateEventStatus: useMutation(api.events.update.status),
    updateCoverUrl: useMutation(api.events.update.cover_url),
    updatePhotoUrl: useMutation(api.events.update.photo_url),
    updateEventCohost: useMutation(api.events.update.cohost),
    updateEventGallery: useMutation(api.events.update.mediaGallery),
    updateEventBasicInfo: useMutation(api.events.update.basicInfo),
    updateEventTicketInfo: useMutation(api.events.update.ticketInfo),
    updateEventIsCoverLight: useMutation(api.events.update.isCoverLight),
  };

  const qry = {
    getEventById: useQry(api.events.get.byId, [{ id: "" }]),
    getAllEvents: useQry(api.events.get.all, []),
    getEventByIds: useQry(api.events.get.byIds, [{ ids: [] }]),
    getEventByHostId: useQry(api.events.get.byHostId, [{ host_id: "" }]),
    // getEventByCohostEmail: (email: string[]) => useQuery(api.events.get.byCohostEmail, {email}),
  };

  return {
    mut,
    qry,
  };
};

export type VxEvents = ReturnType<typeof useVxEvents>;
