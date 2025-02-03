import { use, useCallback, useState } from "react";
import { ConvexCtx } from "../ctx/convex";
import type { InsertEvent } from "convex/events/d";
import { Err, guid, Ok } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { VxCtx } from "../ctx/convex/vx";

interface ComputedDate {
  start_date: number;
  end_date: number;
  duration: number;
}
export interface PrimaryCreateEvent {
  event_name: string;
  event_desc: string;
  event_type: string;
  event_date: string;
  event_time: string;
  event_geo: string;
  event_url: string;
  ticket_count: string;
}

export const useEvent = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { events } = use(ConvexCtx)!;
  const { vx } = use(VxCtx)!;

  const createEvent = useCallback(
    async (data: PrimaryCreateEvent & ComputedDate) => {
      const event_id = guid();
      const args: InsertEvent = {
        ...data,
        event_id,
        event_date: new Date(data.event_date).getTime(),
        event_time: new Date(data.event_time).getTime(),
        ticket_count: Number(data.ticket_count),
        host_id: vx?.account_id,
        host_name: vx?.nickname,
        host_email: vx?.email,
      };
      await events
        .create(args)
        .then(Ok(setLoading, "Event created successfully!"))
        .then(() => router.push(`/e/${event_id}`))
        .catch(Err);
    },
    [events, router, vx?.email, vx?.nickname, vx?.account_id],
  );

  return { createEvent, loading };
};
