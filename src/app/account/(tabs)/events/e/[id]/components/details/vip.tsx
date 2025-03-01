import { ConvexCtx } from "@/app/ctx/convex";
import { onSuccess } from "@/app/ctx/toast";
import { type XEvent } from "@/app/types";
import { Icon, type IconName } from "@/icons";
import { ButtonIcon } from "@/ui/button";
import { Hyper } from "@/ui/button/button";
import { HyperList } from "@/ui/list";
import { Err, getInitials, opts } from "@/utils/helpers";
import { Checkbox, Form, Input, User } from "@nextui-org/react";
import type { VIP } from "convex/events/d";
import {
  type ChangeEvent,
  type MouseEvent,
  use,
  useActionState,
  useCallback,
  useMemo,
  useState,
  memo,
  useReducer,
  startTransition,
} from "react";
import { inputClassNames } from "../../editor";
import SendInvite from "../email/send-invite";
import { BlockHeader } from "./components";
import { vip_info, type VIPField, VIPZod } from "./schema";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { initialVIPState, vipReducer } from "./vip-reducer";

// First, update the VIP type to include all required fields
type VIPWithDefaults = VIP & {
  checked: boolean;
  invitation_sent: boolean;
  tickets_claimed: boolean;
  tickets_used: number;
  created_by: string | null;
  event_id?: string;
  event_name?: string;
  updated_at: number;
};

// Update the VIP state type
export type VIPWithState = VIP & {
  checked: boolean;
  // ...other fields...
};

interface VIPBlockProps {
  data: VIPField[];
  label: string;
  icon: IconName;
  delay?: number;
  editMode?: boolean;
}
interface VIPContentProps {
  xEvent: XEvent | null;
  user_id: string | null;
}

export const VIPContent = ({ xEvent, user_id }: VIPContentProps) => {
  const [state, dispatch] = useReducer(vipReducer, {
    ...initialVIPState,
    vipList: (xEvent?.vip_list ?? []).map((vip) => ({
      ...vip,
      checked: false,
    })),
  });

  const { vipList, selectedVIP } = state;

  const { events } = use(ConvexCtx)!;

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
    () =>
      xEvent?.vip_list?.reduce((acc, cur) => acc + cur.ticket_count, 0) ?? 0,
    [xEvent],
  );

  const updateVIPList = useCallback(
    async (data: VIPWithDefaults) => {
      if (!xEvent?.event_id) return;

      startTransition(async () => {
        try {
          dispatch({ type: "ADD_VIP", payload: data });
          await events.update.vip(xEvent.event_id, data);
        } catch (error) {
          dispatch({ type: "REMOVE_VIP", payload: [data.email] });
          console.error(error);
        }
      });
    },
    [xEvent?.event_id, events.update],
  );

  const addVIP = useCallback(
    (initialState: VIP | undefined, fd: FormData) => {
      const vip = VIPZod.safeParse({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        ticket_count: parseInt(fd.get("ticket_count") as string),
      });

      if (vip.error) {
        console.log(vip.error);
        return;
      }

      const newVIP: VIPWithDefaults = {
        ...defaults,
        ...vip.data,
        created_by: user_id,
        event_id: xEvent?.event_id,
        event_name: xEvent?.event_name,
        updated_at: Date.now(),
      };

      updateVIPList(newVIP)
        .then(() => {
          onSuccess("VIP List updated.");
        })
        .catch(Err);

      return vip.data;
    },
    [updateVIPList, user_id, xEvent?.event_id, xEvent?.event_name, defaults],
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
      const checkedVIPs = vipList.filter((vip) => vip.checked);
      if (!checkedVIPs.length || !xEvent?.event_id) return;

      dispatch({
        type: "REMOVE_VIP",
        payload: checkedVIPs.map((vip) => vip.email),
      });

      startTransition(async () => {
        const updates = Promise.all(
          checkedVIPs.map((vip) =>
            events.update.vip(xEvent.event_id, { ...vip, ticket_count: 0 }),
          ),
        );

        toast
          .promise(updates, {
            loading: "Removing VIPs...",
            success: `Removed ${checkedVIPs.length} VIP${checkedVIPs.length > 1 ? "s" : ""}`,
            error: "Failed to remove VIPs",
          })
          .catch((err) => {
            console.error(err);
            dispatch({ type: "SET_VIP_LIST", payload: vipList });
          });
      });
    },
    [vipList, xEvent?.event_id, events.update],
  );

  const updateSentStatus = useCallback(
    async (email: string, vip: VIP) => {
      if (!xEvent?.event_id) return;
      try {
        dispatch({
          type: "UPDATE_VIP",
          payload: { ...vip, invitation_sent: true, checked: true },
        });
        await events.update.vip(xEvent.event_id, {
          ...vip,
          email,
          invitation_sent: true,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [xEvent?.event_id, events.update],
  );

  const VIPListItem = memo((vip: VIP) => {
    const handleChangeSelected = useCallback(
      (isSelected: boolean) => {
        handleVIPSelection(vip.email, isSelected);
      },
      [vip.email],
    );
    return (
      <Checkbox
        aria-label={vip.name}
        checked={vip.checked}
        className="flex max-w-full"
        color="secondary"
        classNames={{
          base: cn(
            "flex w-full py-3",
            "items-center justify-between hover:bg-chalk/10",
            "cursor-pointer rounded-sm gap-3 px-3",
          ),
          label: "flex tracking-tight w-full justify-between",
          icon: "text-white",
        }}
        isSelected={vip.checked}
        onValueChange={handleChangeSelected}
      >
        <div className="flex w-full items-center justify-between">
          <User
            classNames={{
              name: "whitespace-nowrap font-semibold text-chalk text-xs",
            }}
            avatarProps={{
              size: "sm",
              fallback: getInitials(vip.name)?.toUpperCase(),
              className:
                "bg-transparent border-2 mr-2 bg-vanilla/5 border-gray-500 size-4 text-gray-300/90 font-bold",
            }}
            description={
              <p className="text-tiny text-vanilla/80">{vip.email}</p>
            }
            name={vip.name}
          />
        </div>
        <div className="flex items-center justify-end gap-4 whitespace-nowrap text-chalk">
          <div className="flex w-20 items-center justify-end gap-1 text-sm font-medium text-vanilla">
            <span className="">{vip.ticket_count}</span>
            <Icon name="Ticket" className="opacity-50" />
          </div>
          <div
            className={cn(
              "flex w-28 items-center justify-end gap-1 text-xs font-medium tracking-tighter text-gray-400/90",
              {
                "text-teal-400": vip.invitation_sent,
              },
            )}
          >
            {vip.invitation_sent ? "Sent" : "Not Sent"}
            <Icon
              name="Check"
              className={cn("hidden size-3", { flex: vip.invitation_sent })}
            />
          </div>
        </div>
      </Checkbox>
    );
  });
  VIPListItem.displayName = "VIPListItem";

  const VIPGuestList = useCallback(() => {
    return (
      <section className="relative min-h-96 w-full border-gray-500 bg-primary text-chalk md:border-y md:border-r">
        <div className="h-full w-full overflow-hidden overflow-y-scroll">
          <div className="flex h-11 w-full items-center justify-between border-b-3 border-gray-500/60 px-3 font-inter text-tiny font-bold">
            <div className="flex w-full items-center justify-between font-normal">
              <div className="flex items-center gap-2">
                <span>VIP Guest List</span>
                <div className="flex size-5 items-center justify-center rounded-full bg-vanilla/10 font-sans">
                  {vipList.length}
                </div>
              </div>
              <div className="flex items-center gap-4 text-chalk">
                <div className="flex w-20 items-center justify-end gap-1 text-xs">
                  <span className="font-bold tracking-tight">Tickets</span>
                </div>
                <div className="flex w-28 items-center justify-end gap-1 text-xs">
                  <span className="font-semibold tracking-tight">Invite</span>
                  <Icon
                    name="MailSend"
                    className="-mt-[1px] size-4 text-vanilla"
                  />
                </div>
              </div>
            </div>
          </div>
          <HyperList
            disableAnimation
            data={vipList}
            container="w-full"
            itemStyle="border-b-[0.33px] flex items-center justify-center py-2.5 px-[1px] border-gray-500"
            component={VIPListItem}
            keyId="email"
          />
        </div>
        <div className="absolute bottom-2 right-2">
          <SendInvite
            vip_list={vipList.filter((vip) => vip.checked)}
            updateSentStatus={updateSentStatus}
          />
        </div>
      </section>
    );
  }, [vipList, VIPListItem, updateSentStatus]);

  const RemoveOption = useCallback(() => {
    const checkedCount = vipList.filter((vip) => vip.checked).length;
    const options = opts(
      <Hyper
        disabled={pending || checkedCount === 0}
        loading={pending}
        type="submit"
        label={`Remove ${checkedCount > 1 ? `(${checkedCount})` : ""}`}
        end="Minus"
        destructive
        onClick={handleRemoveVIPs}
      />,
      null,
    );
    return <>{options.get(checkedCount > 0)}</>;
  }, [vipList, pending, handleRemoveVIPs]);

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
        label="Create VIP Guest List"
        icon="VIPIcon2"
        editMode={selectedVIP !== undefined}
      />
    );
  }, [selectedVIP]);

  return (
    <Form action={action}>
      <div className="grid h-full w-full grid-cols-1 overflow-hidden md:grid-cols-2 md:gap-0 md:rounded-lg">
        <section className="h-fit space-y-8 border-b border-gray-500 bg-primary md:h-fit md:border">
          <VIPxBlock />

          <div className="flex h-1/6 w-full items-end justify-between bg-primary">
            <div className="flex w-full items-center border-t border-gray-500 text-chalk">
              <div className="flex h-10 w-full items-center justify-between gap-3 border-r border-gray-500 px-3">
                <p className="font-inter text-xs font-semibold tracking-tight">
                  Claimed
                </p>
                <p className="font-sans text-sm">0</p>
              </div>
              <div className="flex h-10 w-full items-center justify-between gap-3 border-r border-gray-500 px-3">
                <p className="font-inter text-xs font-semibold tracking-tight">
                  Issued
                </p>
                <p className="font-sans text-sm">{issued_tickets}</p>
              </div>
              <RemoveOption />
              <Hyper
                disabled={pending}
                loading={pending}
                type="submit"
                label={selectedVIP ? "Save" : "Add"}
                end={selectedVIP ? "ArrowRightUp" : "Plus"}
                dark
              />
            </div>
          </div>
        </section>
        <VIPGuestList />
      </div>
    </Form>
  );
};

const VIPItem = (field: VIPField) => {
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

    // Update the form field value
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
          <div className="-mb-2 -mr-1.5 flex items-end gap-1.5 md:-mr-1.5">
            <ButtonIcon
              icon="Minus"
              onClick={handlePress(-1)}
              bg="text-gray-200 group-hover/icon:text-gray-300 group-hover/icon:opacity-60"
              disabled={Number(field.value) === 0}
            />
            <ButtonIcon
              icon="Plus"
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
  <div className="h-5/6 w-full space-y-6 border-primary bg-primary p-6 md:border-[0.33px]">
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
      component={VIPItem}
      delay={delay}
      keyId="name"
    />
  </div>
);
