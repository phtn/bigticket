"use client";

import { getAccountID } from "@/app/actions";
import { useConvexCtx } from "@/app/ctx/convex";
import { onError, onSuccess } from "@/app/ctx/toast";
import { useToggle } from "@/hooks/useToggle";
import { Err } from "@/utils/helpers";
import { type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { type SelectEvent } from "convex/events/d";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import type {
  ReactNode,
  Dispatch,
  SetStateAction,
  TransitionStartFunction,
} from "react";

interface TicketData {
  user_account: string | undefined;
  event_account: string | undefined;
  ticket_account: string | undefined;
}
interface LiveViewCtxValues {
  event: SelectEvent | null;
  pending: boolean;
  cover_url: string | null;
  host_id: string | null;
  open: boolean;
  toggle: VoidFunction;
  getQrcode: (data: IDetectedBarcode[]) => void;
  qrcode: string | null;
  ticket_data: TicketData | null;
}
export const LiveViewCtx = createContext<LiveViewCtxValues | null>(null);

// const exampleRawValue ="tickets?x=f7f56ca7a091&e=599a72e25917&t=8bf39e059974--96e0--c6e7--f701--7433e03c";
export const LiveViewCtxProvider = ({ children }: { children: ReactNode }) => {
  const [host_id, setHostId] = useState<string | null>(null);
  const [cover_url, setCoverUrl] = useState<string | null>(null);
  const [qrcode, setQrcode] = useState<string | null>(null);
  const [ticket_data, setTicketData] = useState<TicketData | null>(null);

  const pathname = usePathname();
  const ids = pathname.split("/").pop();
  const [event_id] = ids?.split("---") ?? ["", ""];

  const [pending, fn] = useTransition();
  const { open, toggle } = useToggle();
  const [event, setEvent] = useState<SelectEvent | null>(null);

  const { vxFiles, vxUsers, vxEvents } = useConvexCtx();

  const getEventById = vxEvents.qry.getEventById as (
    id: string,
  ) => SelectEvent | null;

  const setFn = <T,>(
    tx: TransitionStartFunction,
    action: () => Promise<T>,
    set: Dispatch<SetStateAction<T>>,
  ) => {
    tx(async () => {
      set(await action());
    });
  };

  useEffect(() => {
    if (event_id) {
      setFn(
        fn,
        async () => {
          const event = getEventById(event_id);
          setEvent(event);
          return event;
        },
        setEvent,
      );
    }
  }, [event_id, getEventById]);

  useEffect(() => {
    if (event?.cover_url) {
      setFn(
        fn,
        async () => {
          const src = await vxFiles.getUrl(event?.cover_url);
          return src;
        },
        setCoverUrl,
      );
    }
  }, [event?.cover_url, vxFiles]);

  useEffect(() => {
    setFn(
      fn,
      async () => {
        return await getAccountID();
      },
      setHostId,
    );
  }, []);

  const getQrcode = useCallback((data: IDetectedBarcode[]) => {
    setQrcode(data?.[0]?.rawValue ?? null);
  }, []);

  const scannable_tickets = useMemo(() => {
    return event?.tickets
      ?.filter((ticket) => !ticket.is_claimed)
      .map((t) => t.ticket_id);
  }, [event]);

  const findAndValidateTicket = useCallback(
    async (ticket_account: string | undefined) => {
      if (!scannable_tickets) return false;
      if (!ticket_account) {
        onError("Ticket not found.");
        return false;
      }
      const ticket_id = ticket_account?.split("--").reverse().join("-");
      if (scannable_tickets.includes(ticket_id)) {
        const validTicket = event?.tickets?.find(
          (t) => t.ticket_id === ticket_id,
        );
        try {
          if (!validTicket?.user_id) return;
          validTicket.is_claimed = true;
          await vxUsers.mut.updateUserTickets({
            id: validTicket.user_id,
            tickets: [validTicket],
          });
          onSuccess("Ticket Validated");
        } catch (e) {
          onError("Ticket validation failed");
          console.error(e);
          return false;
        }
      } else {
        onError("Ticket already used");
        return false;
      }
    },
    [scannable_tickets, event?.tickets, vxUsers.mut],
  );

  const processQrcode = useCallback(async () => {
    if (!qrcode) return;
    const [x, e, t] = qrcode.substring(qrcode.indexOf("?") + 1).split("&");

    const user_account = x?.split("=").pop();
    const event_account = e?.split("=").pop();
    const ticket_account = t?.split("=").pop();
    setTicketData({ user_account, event_account, ticket_account });

    if (event_account === event?.event_id.split("-").pop()) {
      // user ticket validation
      await findAndValidateTicket(ticket_account);
      setQrcode(null);
    } else {
      onError("Invalid ticket");
      setQrcode(null);
    }
  }, [qrcode, event?.event_id, findAndValidateTicket]);

  useEffect(() => {
    processQrcode().catch(Err);
  }, [processQrcode]);

  useEffect(() => {
    console.log(pending, event_id);
  }, [pending, event_id]);

  const value = useMemo(
    () => ({
      event,
      pending,
      cover_url,
      host_id,
      open,
      toggle,
      getQrcode,
      qrcode,
      ticket_data,
    }),
    [
      event,
      pending,
      cover_url,
      host_id,
      open,
      toggle,
      getQrcode,
      qrcode,
      ticket_data,
    ],
  );
  return <LiveViewCtx value={value}>{children}</LiveViewCtx>;
};
