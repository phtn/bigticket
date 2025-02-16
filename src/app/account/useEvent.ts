import { use, useCallback, useState } from "react";
import { ConvexCtx } from "../ctx/convex";
import type { InsertEvent } from "convex/events/d";
import { Err, guid, Ok } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { VxCtx } from "../ctx/convex/vx";

export const useEvent = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { events } = use(ConvexCtx)!;
  const { vx } = use(VxCtx)!;

  const createEvent = useCallback(
    async (data: InsertEvent) => {
      const event_id = guid();
      const args: InsertEvent = {
        ...data,
        event_id,
        host_id: vx?.account_id,
        host_name: vx?.nickname,
        host_email: vx?.email,
      };

      await events
        .create(args)
        .then(Ok(setLoading, "Event created successfully!"))
        .then(() =>
          router.push(`account/events/e/${event_id}---${vx?.account_id}`),
        )
        .catch(Err);
    },
    [events, router, vx?.email, vx?.nickname, vx?.account_id],
  );

  return { createEvent, loading };
};
