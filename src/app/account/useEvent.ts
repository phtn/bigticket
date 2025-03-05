import { useCallback, useState } from "react";
import { useConvexCtx } from "../ctx/convex";
import type { InsertEvent } from "convex/events/d";
import { Err, guid, Ok } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useUserCtx } from "../ctx/user";

export const useEvent = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { vxEvents } = useConvexCtx();
  const { xUser } = useUserCtx();

  const createEvent = useCallback(
    async (data: InsertEvent) => {
      const event_id = guid();
      const args: InsertEvent = {
        ...data,
        event_id,
        host_id: xUser?.account_id,
        host_name: xUser?.nickname,
        host_email: xUser?.email,
      };

      await vxEvents.mut
        .create(args)
        .then(Ok(setLoading, "Event created successfully!"))
        .then(() =>
          router.push(`/account/events/e/${event_id}---${xUser?.account_id}`),
        )
        .catch(Err);
    },
    [vxEvents.mut, router, xUser?.email, xUser?.nickname, xUser?.account_id],
  );

  return { createEvent, loading };
};
