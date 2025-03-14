import { useConvexCtx } from "@/app/ctx/convex";
import { useConvexUtils } from "@/app/ctx/convex/useConvexUtils";
import { onSuccess, onWarn } from "@/app/ctx/toast";
import { cn } from "@/lib/utils";
import { Hyper } from "@/ui/button/button";
import { HyperList } from "@/ui/list";
import { Err, getInitials, opts } from "@/utils/helpers";
import { Checkbox, Form, Input, User } from "@nextui-org/react";
import { api } from "@vx/api";
import type { SelectEvent, VIP } from "convex/events/d";
import { useQuery } from "convex/react";
import {
  type ChangeEvent,
  type MouseEvent,
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import toast from "react-hot-toast";
import { Nebula } from "../";
import { inputClassNames } from "../../../editor";
import SendInvite from "../../email/send-invite";
import { BlockHeader } from "../components";
import { vip_info, type VIPField, VIPZod } from "../schema";
import { initialVIPState, vipReducer } from "./reducer";
import type { VIPBlockProps, VIPContentProps, VIPWithDefaults } from "./types";
import { checkedState } from "../utils";
import { Iconx } from "@/icons/icon";
import { BtnIcon } from "@/ui/button";

export const VIPContent = ({ user_id, event_id }: VIPContentProps) => {
  const [event, setEvent] = useState<SelectEvent | null>();
  const { q } = useConvexUtils();

  const queryEvent = useQuery(api.events.get.byId, {
    id: q(event_id),
  }) as SelectEvent;

  const [state, dispatch] = useReducer(vipReducer, {
    ...initialVIPState,
    vipList: [] as VIPWithDefaults[],
  });

  const { vipList, selectedVIP } = state;

  useEffect(() => {
    if (event_id && queryEvent) {
      setEvent(queryEvent);
      const payload =
        queryEvent.vip_list
          ?.slice()
          .map((v) => ({
            ...v,
            checked: false,
            name: v.name ?? "",
            event_id: event_id,
            event_name: event?.event_name,
            invitation_sent: !!v.invitation_sent,
            tickets_claimed: !!v.tickets_claimed,
            tickets_used: v.tickets_used ?? 0,
            created_by: user_id,
            updated_at: v.updated_at ?? Date.now(),
          }))
          .reverse() ?? [];
      dispatch({ type: "SET_VIP_LIST", payload });
    }
  }, [event_id, queryEvent, user_id, event?.event_name]);

  const { checked, count, onEdit } = useMemo(
    () => checkedState<VIPWithDefaults>(vipList),
    [vipList],
  );

  const { vxEvents } = useConvexCtx();

  const initialState: VIP = useMemo(
    () => ({
      name: "",
      email: "",
      ticket_count: 1,
    }),
    [],
  );

  const defaults = useMemo(
    () => ({
      checked: false,
      invitation_sent: false,
      tickets_claimed: false,
      tickets_used: 0,
    }),
    [],
  );

  const issued_tickets = useMemo(
    () => event?.vip_list?.reduce((acc, cur) => acc + cur.ticket_count, 0) ?? 0,
    [event],
  );
  const claimed_tickets = useMemo(
    () =>
      event?.vip_list?.reduce(
        (acc, cur) => (cur.tickets_claimed ? acc + cur.ticket_count : acc),
        0,
      ) ?? 0,
    [event],
  );

  const updateEventVIP = useCallback(
    async (id: string, vip: VIP) => {
      (await vxEvents.mut.updateEventVIP({ id, vip })) as string;
    },
    [vxEvents.mut],
  );

  const updateVIPList = useCallback(
    async (data: VIPWithDefaults) => {
      if (!event_id) return;

      startTransition(async () => {
        try {
          if (onEdit) {
            dispatch({ type: "UPDATE_VIP", payload: data });
            console.log("update");
            return await updateEventVIP(event_id, data as VIP);
          }
          dispatch({ type: "ADD_VIP", payload: data });
          console.log("add");
          return await updateEventVIP(event_id, data as VIP);
        } catch (error) {
          dispatch({ type: "REMOVE_VIP", payload: [data.email] });
          console.error(error);
        }
      });
    },
    [event_id, updateEventVIP, onEdit],
  );

  const addVIP = useCallback(
    (initialState: VIP | undefined, fd: FormData) => {
      const vip = VIPZod.safeParse({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        ticket_count: parseInt(fd.get("ticket_count") as string),
      });

      if (vip.error) {
        onWarn("Invalid email address.");
        return;
      }

      const newVIP: VIPWithDefaults = {
        ...defaults,
        ...vip.data,
        event_id,
        created_by: user_id,
        name: vip.data.name!,
        email: vip.data.email,
        event_name: event?.event_name,
        ticket_count: vip.data.ticket_count,
        updated_at: Date.now(),
      };

      updateVIPList(newVIP)
        .then(() => {
          onSuccess("Guest List updated.");
        })
        .catch(Err);

      return vip.data;
    },
    [updateVIPList, user_id, event_id, event?.event_name, defaults],
  );

  const [, action, pending] = useActionState(addVIP, initialState);

  const handleVIPSelection = useCallback(
    (email: string, isSelected: boolean) => {
      startTransition(() => {
        dispatch({
          type: "SELECT_VIP",
          payload: { email, isSelected },
        });
      });
    },
    [],
  );

  const handleRemoveVIPs = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      if (!checked.length || !event_id) return;

      dispatch({
        type: "REMOVE_VIP",
        payload: checked.map((vip) => vip.email),
      });

      startTransition(async () => {
        const updates = Promise.all(
          checked.map((vip) => {
            const vipUpdate = {
              ...vip,
              ticket_count: 0,
            };
            return updateEventVIP(event_id, vipUpdate);
          }),
        );

        toast
          .promise(updates, {
            loading: "Removing VIPs...",
            success: `Removed ${count} VIP${count > 1 ? "s" : ""}`,
            error: "Failed to remove VIPs",
          })
          .catch((err) => {
            console.error(err);
            dispatch({ type: "SET_VIP_LIST", payload: vipList });
          });
      });
    },
    [vipList, count, event_id, updateEventVIP, checked],
  );

  const updateSentStatus = useCallback(
    async (email: string, vip: VIP) => {
      if (!event_id) return;

      try {
        dispatch({
          type: "UPDATE_VIP",
          payload: {
            ...vip,
            email,
            invitation_sent: true,
          },
        });
        await updateEventVIP(event_id, {
          ...vip,
          email,
          invitation_sent: true,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [event_id, updateEventVIP],
  );

  const VIPListItem = useCallback(
    (vip: VIPWithDefaults) => {
      const handleChangeSelected = (isSelected: boolean) => {
        handleVIPSelection(vip.email, isSelected);
      };

      return (
        <Checkbox
          name={vip.email}
          disableAnimation={false}
          color="secondary"
          classNames={{
            base: cn(
              "flex items-center relative min-w-full justify-between p-4",
              "hover:bg-vanilla/5 rounded-sm cursor-pointer",
            ),
            label: "flex items-center tracking-tight w-full max-w-full",
            icon: "text-primary",
            wrapper: "ml-4",
          }}
          isSelected={vip.checked}
          onValueChange={handleChangeSelected}
        >
          <div
            className={cn(
              "absolute -left-12 top-0 z-10 font-sans text-[10px] text-vanilla opacity-40",
              { "text-teal-400 opacity-100": vip.checked },
            )}
          >
            {vip.idx}
          </div>
          <div className="flex w-full items-center justify-between ps-2 md:ps-0">
            <User
              classNames={{
                name: "whitespace-nowrap font-semibold text-chalk text-xs font-inter",
              }}
              avatarProps={{
                size: "sm",
                fallback: getInitials(vip.name)?.toUpperCase(),
                className:
                  "text-[16px] hidden overflow-hidden md:flex ml-2 mr-1 bg-macd-blue/30 rounded-md border-vanilla/20 text-vanilla/90 flex-grow-0 font-semibold",
              }}
              description={
                <p className="font-inter text-tiny text-vanilla/80">
                  {vip.email}
                </p>
              }
              name={vip.name}
            />
          </div>

          <div className="flex items-center justify-end whitespace-nowrap text-chalk">
            <div className="flex w-14 items-center justify-center gap-[1.5px] text-sm font-medium text-vanilla md:w-20">
              <span className="font-sans">{vip.ticket_count}</span>
            </div>
            <div
              className={cn(
                "flex w-14 items-center justify-center gap-[1.5px] text-xs font-semibold tracking-tighter text-vanilla/40 md:w-28 md:justify-end",
                {
                  "text-teal-400": vip.invitation_sent,
                },
              )}
            >
              {vip.invitation_sent ? "Sent" : "Not Sent"}
              <Iconx
                name="check"
                className={cn("hidden size-2.5", { flex: vip.invitation_sent })}
              />
            </div>
          </div>
        </Checkbox>
      );
    },
    [handleVIPSelection],
  );

  const ListActions = useCallback(() => {
    const options = opts(
      <div className="flex">
        <Hyper
          lg
          fullWidth
          end="minus-sign"
          destructive
          type="submit"
          loading={pending}
          onClick={handleRemoveVIPs}
          disabled={pending || count === 0}
          label={`Remove ${count > 1 ? `(${count})` : "(1)"}`}
          className={cn("delay-100", { "animate-enter": count <= 1 })}
        />
        <SendInvite vip_list={checked} updateSentStatus={updateSentStatus} />
      </div>,
      null,
    );
    return (
      <div className="absolute bottom-[0.77px] right-[0.77px] flex w-fit overflow-hidden rounded-br-md md:min-w-36">
        {options.get(count > 0)}
      </div>
    );
  }, [count, checked, pending, handleRemoveVIPs, updateSentStatus]);

  const VIPGuestList = useCallback(() => {
    return (
      <section className="relative col-span-3 min-h-96 w-full border-vanilla/20 text-chalk md:border-[0.33px]">
        <div className="h-full w-full overflow-hidden overflow-y-scroll">
          <div className="flex h-14 w-full items-center justify-between border-b-3 border-vanilla/20 px-4 font-inter text-tiny font-bold md:h-11">
            <div className="flex w-full items-center justify-between font-normal">
              <div className="flex items-center">
                <div className="w-0"></div>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="flex items-center gap-2">
                    <Iconx name="energy" className="size-4 text-orange-400" />{" "}
                    Guest List
                  </span>
                  <div className="flex size-5 items-center justify-center rounded-full bg-vanilla/5 font-sans text-sm font-semibold text-vanilla">
                    {vipList ? (
                      vipList.length
                    ) : (
                      <Iconx name="spinners-bouncing-ball" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-chalk">
                <div className="flex w-14 items-center justify-center gap-1 text-xs md:w-20 md:justify-end">
                  <span className="hidden font-bold tracking-tight md:flex">
                    Tickets
                  </span>
                  <Iconx
                    name="ticket-horizontal"
                    className="-mt-[1px] size-4 text-vanilla"
                  />
                </div>
                <div className="flex w-14 items-center justify-center gap-1 text-xs md:w-28 md:justify-end">
                  <span className="hidden font-semibold tracking-tight md:flex">
                    Invite
                  </span>
                  <Iconx
                    name="mail-send"
                    className="-mt-[1px] size-4 text-vanilla"
                  />
                </div>
              </div>
            </div>
          </div>
          <HyperList
            disableAnimation
            data={vipList}
            container="min-w-full overflow-hidden"
            itemStyle="border-b-[0.33px] border-dotted flex justify-center w-full py-[8.5px] border-vanilla/30"
            component={VIPListItem}
            reversed
            keyId="idx"
          />
        </div>
        <ListActions />
      </section>
    );
  }, [vipList, VIPListItem, ListActions]);

  const VIPxBlock = useCallback(() => {
    const fields = [
      {
        name: "name",
        defaultValue: selectedVIP?.name ?? "",
        value: selectedVIP?.name ?? "",
        ...vip_info[0],
      },
      {
        name: "email",
        defaultValue: selectedVIP?.email ?? "",
        value: selectedVIP?.email ?? "",
        ...vip_info[1],
      },
      {
        name: "ticket_count",
        defaultValue: String(selectedVIP?.ticket_count ?? 1),
        value: selectedVIP?.ticket_count ?? 1,
        ...vip_info[2],
      },
    ] as VIPField[];

    return (
      <VIPBlock
        data={fields}
        label="Create Guest List"
        icon="user-add"
        editMode={selectedVIP !== undefined}
      />
    );
  }, [selectedVIP]);

  return (
    <Nebula>
      <Form action={action}>
        <div className="grid h-full w-full grid-cols-1 overflow-hidden md:grid-cols-5 md:rounded-[8.77px]">
          <section className="col-span-2 h-fit space-y-6 border-b-[0.33px] border-vanilla/20">
            <VIPxBlock />

            <div className="flex h-1/6 w-full items-end justify-between border-r-[0.0px] border-vanilla/20">
              <div className="flex w-full items-center border-t-[0.33px] border-vanilla/20 text-chalk">
                <div className="flex h-14 w-full items-center justify-between gap-3 border-r-[0.33px] border-vanilla/20 px-3">
                  <p className="font-inter text-xs font-semibold tracking-tight">
                    Claimed
                  </p>
                  <p className="font-sans text-sm">{claimed_tickets}</p>
                </div>
                <div className="flex h-14 w-full items-center justify-between gap-3 border-r-[0.33px] border-vanilla/20 px-3">
                  <p className="font-inter text-xs font-semibold tracking-tight">
                    Issued
                  </p>
                  <p className="font-sans text-sm">{issued_tickets}</p>
                </div>
                <Hyper
                  end={selectedVIP ? "square-arrow-up-right" : "plus-sign"}
                  label={selectedVIP ? "Update" : "Add"}
                  disabled={pending}
                  loading={pending}
                  active={onEdit}
                  type="submit"
                  fullWidth
                  dark
                  xl
                />
              </div>
            </div>
          </section>
          <VIPGuestList />
        </div>
      </Form>
    </Nebula>
  );
};

const VIPFieldItem = (field: VIPField) => {
  const [ticketCount, setTicketCount] = useState(
    field.name === "ticket_count" ? Number(field.value ?? 1) : 1,
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;

    if (field.name === "ticket_count") {
      const numValue = parseInt(value) ?? 1;
      if (numValue === 0) return; // Prevent negative values
    }

    const item = e.target.form?.elements.namedItem(
      field.name,
    ) as HTMLInputElement;
    item.setAttribute("defaultValue", value);
  };

  const handlePress = useCallback(
    (n: number) => (e: MouseEvent) => {
      e.preventDefault();
      if (field.name === "ticket_count") {
        const newValue = Math.max(0, ticketCount + n);
        setTicketCount(newValue);
      }
    },
    [field, ticketCount],
  );

  return (
    <Input
      label={field.label}
      name={field.name}
      id={field.name}
      autoComplete={field.name}
      type={field.type}
      isClearable={field.name !== "ticket_count"}
      onChange={handleChange}
      defaultValue={
        field.name === "ticket_count" ? undefined : String(field.value)
      }
      value={field.name === "ticket_count" ? String(ticketCount) : undefined}
      classNames={inputClassNames}
      placeholder={field.placeholder}
      isRequired={field.required}
      validationBehavior="native"
      className="appearance-none"
      endContent={
        field.name === "ticket_count" ? (
          <div className="-mb-1 mr-1.5 flex items-end gap-1.5">
            <BtnIcon
              icon="minus-sign"
              onClick={handlePress(-1)}
              bg="text-gray-200 group-hover/icon:text-gray-300 group-hover/icon:opacity-60"
              disabled={Number(field.value) === 0}
            />
            <BtnIcon
              icon="plus-sign"
              onClick={handlePress(1)}
              shadow="hidden"
              bg="text-gray-200 group-hover/icon:text-gray-300 group-hover/icon:opacity-60"
            />
          </div>
        ) : null
      }
    />
  );
};
const VIPBlock = ({
  data,
  icon,
  label,
  delay = 0,
  editMode = false,
}: VIPBlockProps) => (
  <div className="h-5/6 w-full space-y-8 p-6">
    <BlockHeader label={label} icon={icon} editMode={editMode} />
    <section className="h-fit rounded bg-gray-400/10 px-4 py-3 text-justify text-tiny text-cake md:p-4 md:text-sm">
      Fill out the name, email of the VIP and add the number of tickets. You can
      add multiple VIPs by clicking the{" "}
      <strong className="text-vanilla">Add</strong> button. You can reduce the
      number of tickets given by entering a negative value.
    </section>
    <HyperList
      data={data}
      disableAnimation
      container="space-y-6 p-1"
      itemStyle="whitespace-nowrap"
      component={VIPFieldItem}
      delay={delay}
      keyId="name"
    />
  </div>
);
