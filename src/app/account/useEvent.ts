import { useCallback, useState } from "react";
import { useConvexCtx } from "../ctx/convex";
import type { InsertEvent } from "convex/events/d";
import { Err, guid, Ok } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useAccountCtx } from "@/app/ctx/accounts";

export const useEvent = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { vxEvents } = useConvexCtx();
  const { xAccount } = useAccountCtx();

  const createEvent = useCallback(
    async (data: InsertEvent) => {
      const event_id = guid();
      const args: InsertEvent = {
        ...data,
        event_id,
        host_id: xAccount?.account_id,
        host_name: xAccount?.nickname,
        host_email: xAccount?.email,
      };

      await vxEvents.mut
        .create(args)
        .then(Ok(setLoading, "Event created successfully!"))
        .then(() =>
          router.push(
            `/account/events/e/${event_id}---${xAccount?.account_id}`,
          ),
        )
        .catch(Err);
    },
    [
      vxEvents.mut,
      router,
      xAccount?.email,
      xAccount?.nickname,
      xAccount?.account_id,
    ],
  );

  return { createEvent, loading };
};
