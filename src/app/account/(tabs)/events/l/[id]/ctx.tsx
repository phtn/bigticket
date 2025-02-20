"use client";

import { getAccountID } from "@/app/actions";
import { ConvexCtx } from "@/app/ctx/convex";
import { useToggle } from "@/hooks/useToggle";
import { Err } from "@/utils/helpers";
import { type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { type SelectEvent } from "convex/events/d";
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";

interface TicketData {
  user_account: string | undefined;
  event_account: string | undefined;
  ticket_account: string | undefined;
}
interface LiveViewCtxValues {
  event: SelectEvent | null;
  getEventId: (id: string | null) => void;
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
  const [event_id, setEventId] = useState<string | null>(null);
  const [host_id, setHostId] = useState<string | null>(null);
  const [event, setEvent] = useState<SelectEvent | null>(null);
  const [cover_url, setCoverUrl] = useState<string | null>(null);
  const [qrcode, setQrcode] = useState<string | null>(null);
  const [ticket_data, setTicketData] = useState<TicketData | null>(null);
  const [pending, fn] = useTransition();
  const { open, toggle } = useToggle();

  const { events, files } = use(ConvexCtx)!;

  const setFn = <T,>(
    tx: TransitionStartFunction,
    action: () => Promise<T>,
    set: Dispatch<SetStateAction<T>>,
  ) => {
    tx(async () => {
      set(await action());
    });
  };

  const getEventById = useCallback(
    async () => (event_id ? await events.get.byId(event_id) : null),
    [event_id, events.get],
  );

  const getEvent = useCallback(() => {
    setFn(fn, getEventById, setEvent);
  }, [getEventById]);

  const getEventId = useCallback((id: string | null) => {
    setEventId(id);
  }, []);

  useEffect(() => {
    getEvent();
  }, [getEvent]);

  const getImageSrc = useCallback(
    async () => (event ? await files.get(event.cover_url) : null),
    [event, files],
  );
  const getCoverUrl = useCallback(() => {
    setFn(fn, getImageSrc, setCoverUrl);
  }, [getImageSrc]);

  useEffect(() => {
    getCoverUrl();
  }, [getCoverUrl]);

  const getAccountById = useCallback(
    async () => (await getAccountID()) ?? null,
    [],
  );

  const getHostId = useCallback(() => {
    setFn(fn, getAccountById, setHostId);
  }, [getAccountById]);

  useEffect(() => {
    getHostId();
  }, [getHostId]);

  const getQrcode = useCallback((data: IDetectedBarcode[]) => {
    console.log(data);
    console.log(data?.[0]);
    console.log(data?.[0]?.rawValue);
    console.log(data?.[0]?.format);
    setQrcode(data?.[0]?.rawValue ?? null);
  }, []);

  const processQrcode = useCallback(async () => {
    if (!qrcode) return;
    const [user_account, event_account, ticket_account] = qrcode
      .substring(qrcode.indexOf("?") + 1)
      .split("&");
    setTicketData({ user_account, event_account, ticket_account });
  }, [qrcode]);

  useEffect(() => {
    processQrcode().catch(Err);
  }, [processQrcode]);

  const value = useMemo(
    () => ({
      event,
      getEventId,
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
      getEventId,
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
