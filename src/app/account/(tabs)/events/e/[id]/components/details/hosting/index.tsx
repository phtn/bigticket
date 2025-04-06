import { useConvexCtx } from "@/app/ctx/convex";
import { useConvexUtils } from "@/app/ctx/convex/useConvexUtils";
import { onSuccess, onWarn } from "@/app/ctx/toast";
import { Iconx } from "@/icons";
import { cn } from "@/lib/utils";
import { Hyper } from "@/ui/button/button";
import { HyperList } from "@/ui/list";
import { Err, getInitials, opts } from "@/utils/helpers";
import { Checkbox, Form, User } from "@nextui-org/react";
import { api } from "@vx/api";
import type { Cohost, CohostClearance } from "convex/events/d";
import { useQuery } from "convex/react";
import { type SelectUser } from "convex/users/d";
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
import { XndInvite } from "../../email/resend/send-vip-invite";
import { BlockHeader } from "../components";
import { type CohostField, CohostZod } from "../schema";
import { checkedState, updateProps } from "../utils";
import { Clearances, CohostList, FieldItem, Reference } from "./components";
import { cohostReducer, initialCohostState } from "./reducer";
import type { CohostContentProps, CohostWithDefaults } from "./types";

export const HostSettings = ({ xEvent, user_id }: CohostContentProps) => {
  const { vxEvents, vxLogs } = useConvexCtx();
  const [vx, setVx] = useState<SelectUser | null>(null);
  const { q } = useConvexUtils();
  const qUser = useQuery(api.users.get.byId, { id: q(user_id) });

  useEffect(() => {
    if (qUser) {
      setVx(qUser);
    }
  }, [qUser]);

  const [state, dispatch] = useReducer(cohostReducer, {
    ...initialCohostState,
    cohostList: xEvent?.cohost_list ?? ([] as CohostWithDefaults[]),
  });

  const { cohostList, selectedCohost } = state;

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
  });

  const [clearanceValues, setClearanceValues] = useState<CohostClearance>({
    scan_code: true,
    add_vip: false,
    view_guest_list: false,
  });

  const { checked, count, onEdit } = useMemo(
    () => checkedState<CohostWithDefaults>(cohostList),
    [cohostList],
  );

  // Update form values when selectedCohost changes
  useEffect(() => {
    if (selectedCohost && onEdit) {
      setFormValues({
        name: selectedCohost.name ?? "",
        email: selectedCohost.email ?? "",
      });
      if (selectedCohost.clearance) {
        setClearanceValues(selectedCohost.clearance);
      }
    } else {
      setFormValues({ name: "", email: "" });
      setClearanceValues({
        scan_code: false,
        add_vip: false,
        view_guest_list: false,
      });
    }
  }, [selectedCohost, onEdit]);

  const createLog = useCallback(
    async (type: string, description?: string) => {
      if (!user_id) return;
      await vxLogs.mut.create({
        type,
        user_id,
        event_id: xEvent?.event_id,
        description,
        created_by: vx?.nickname,
      });
    },
    [vxLogs.mut, user_id, xEvent?.event_id, vx?.nickname],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const { name, value } = e.target;
      setFormValues((prev) => ({ ...prev, [name]: value }));
    },
    [setFormValues],
  );

  const cohost_info: CohostField[] = useMemo(
    () => [
      {
        name: "name",
        type: "text",
        label: "Name",
        onChange: handleInputChange,
        placeholder: "Name of the co-host",
        value: formValues.name,
        required: false,
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        onChange: handleInputChange,
        value: formValues.email,
        placeholder: "Email receiving the invitation",
        required: true,
      },
    ],
    [formValues, handleInputChange],
  );

  const updateEventCohost = useCallback(
    async (id: string, cohost: Cohost) => {
      await vxEvents.mut.updateEventCohost({ id, cohost });
    },
    [vxEvents.mut],
  );

  const updateCohostList = useCallback(
    async (data: Cohost) => {
      if (!xEvent?.event_id) return;
      startTransition(async () => {
        try {
          if (onEdit) {
            dispatch({ type: "UPDATE_COHOST", payload: data });
            return await updateEventCohost(xEvent.event_id, data);
          }
          dispatch({ type: "ADD_COHOST", payload: data });
          return await updateEventCohost(xEvent.event_id, data);
        } catch (error) {
          dispatch({ type: "REMOVE_COHOST", payload: [data.email] });
          console.error(error);
        }
      });
      return await vxEvents.mut.updateEventCohost({
        id: q(xEvent?.event_id),
        cohost: data,
      });
    },
    [xEvent?.event_id, vxEvents.mut, q, onEdit, updateEventCohost],
  );

  const addCohost = useCallback(
    async (initialState: Cohost | undefined, fd: FormData) => {
      const cohost = CohostZod.safeParse({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
      });

      if (cohost.error) {
        onWarn("Invalid email address.");
        return;
      }
      await updateCohostList({
        ...cohost.data,
        created_by: user_id,
        event_id: xEvent?.event_id,
        event_name: xEvent?.event_name,
        updated_at: Date.now(),
        clearance: clearanceValues,
        status: "active",
        confirmed: false,
      })
        .then(() => {
          onSuccess("Added Co-host");
        })
        .catch(Err);
      return {
        ...cohost.data,
      };
    },
    [
      updateCohostList,
      user_id,
      clearanceValues,
      xEvent?.event_id,
      xEvent?.event_name,
    ],
  );

  const [, action, pending] = useActionState(addCohost, {
    name: selectedCohost?.name ?? "",
    email: selectedCohost?.email ?? "",
  });

  const handleAccessValuesChange = useCallback(
    (values: string[]) => {
      const updatedClearance = updateProps(
        clearanceValues,
        values ?? [],
      ) as CohostClearance;
      setClearanceValues(updatedClearance);
    },
    [clearanceValues],
  );

  const handleRemoveCohost = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      if (!checked.length || !xEvent?.event_id) return;

      dispatch({
        type: "REMOVE_COHOST",
        payload: checked.map((c) => c.email),
      });

      startTransition(async () => {
        const updates = Promise.all(
          checked.map((c) =>
            updateEventCohost(xEvent.event_id, { ...c, status: "inactive" }),
          ),
        );

        toast
          .promise(updates, {
            loading: `Removing Cohost${checked.length > 1 ? "s" : ""}...`,
            success: `Removed ${count} Cohost${count > 1 ? "s" : ""}`,
            error: "Failed to remove Cohosts",
          })
          .catch((err) => {
            console.error(err);
            dispatch({ type: "SET_COHOST_LIST", payload: checked });
          });
      });
    },
    [checked, xEvent?.event_id, count, updateEventCohost],
  );

  const handleUserSelect = useCallback((email: string, isSelected: boolean) => {
    startTransition(() => {
      dispatch({
        type: "SELECT_COHOST",
        payload: { email, isSelected },
      });
    });
  }, []);

  const updateSentStatus = useCallback(
    async (email: string, data: Cohost) => {
      if (!xEvent?.event_id) return;

      try {
        dispatch({
          type: "UPDATE_COHOST",
          payload: {
            ...data,
            email,
            invitation_sent: true,
          },
        });
        await updateEventCohost(xEvent.event_id, {
          ...data,
          email,
          invitation_sent: true,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [xEvent?.event_id, updateEventCohost],
  );

  // Add effect to update clearance values when cohost is selected
  useEffect(() => {
    if (selectedCohost?.clearance) {
      setClearanceValues(selectedCohost.clearance);
    }
  }, [selectedCohost]);

  const RowItem = useCallback(
    (cohost: Cohost) => {
      const handleChangeSelected = (isSelected: boolean) => {
        handleUserSelect(cohost.email, isSelected);
      };
      return (
        <Checkbox
          name={cohost.email}
          disableAnimation={false}
          color="secondary"
          classNames={{
            base: cn(
              "flex items-center relative min-w-full justify-between py-4",
              "md:hover:bg-macl-orange/5 data-[selected=true]:bg-teal-400/10 rounded-sm md:cursor-pointer",
            ),
            label: "flex items-center tracking-tight w-full max-w-full",
            icon: "text-chalk",
            wrapper: "md:ml-4 bg-white border-blue-500",
          }}
          isSelected={cohost.checked}
          onValueChange={handleChangeSelected}
        >
          <div
            className={cn(
              "absolute -left-8 -top-5 z-10 font-sans text-[10px] text-primary opacity-80 md:-left-12",
              { "text-teal-600 opacity-100": cohost.checked },
            )}
          >
            {cohost.idx}
          </div>
          <div className="flex w-full items-center justify-between">
            <User
              classNames={{
                name: "whitespace-nowrap font-semibold md:text-[15px] font-sans text-primary tracking-normal",
              }}
              avatarProps={{
                size: "sm",
                fallback: getInitials(cohost.name)?.toUpperCase(),
                className:
                  "overflow-hidden md:flex md:ml-2 md:mr-1 bg-macd-blue rounded-full text-chalk md:text-lg flex-grow-0 font-semibold",
              }}
              description={
                <p className="truncate text-primary/80 md:text-sm">
                  {cohost.email}
                </p>
              }
              name={cohost.name}
            />
          </div>

          <div className="flex items-center justify-end whitespace-nowrap">
            <div className="flex w-20 items-center justify-end space-x-1">
              <span
                className={cn("hidden size-5 rounded-md bg-warning", {
                  flex: cohost.clearance?.add_vip,
                })}
              />
              <span
                className={cn("hidden size-5 rounded-md bg-secondary", {
                  flex: cohost.clearance?.scan_code,
                })}
              />
              <span
                className={cn("hidden size-5 rounded-md bg-danger", {
                  flex: cohost.clearance?.view_guest_list,
                })}
              />
            </div>
            <div
              className={cn(
                "flex w-12 items-center justify-end text-xs font-semibold tracking-tight text-primary/60 md:pe-2 lg:w-24",
                {
                  "text-macd-blue": cohost.invitation_sent,
                },
              )}
            >
              <div
                className={cn("flex items-center space-x-0.5", {
                  "": cohost.invitation_sent,
                })}
              >
                {/* <span>{cohost.invitation_sent ? "Confirmed" : "Not Sent"}</span> */}
                <Iconx
                  name={
                    cohost.confirmed
                      ? "mail-received"
                      : cohost.invitation_sent
                        ? "mail-sent"
                        : "mail-not-sent"
                  }
                  className={cn("rounded-lg text-macl-gray", {
                    "bg-gradient-to-b from-macd-blue/15 via-sky-400/5 to-transparent text-macl-blue":
                      cohost.invitation_sent,
                    "bg-gradient-to-b from-teal-400/15 via-teal-400/5 to-transparent text-teal-500":
                      cohost.confirmed,
                  })}
                />
              </div>
            </div>
          </div>
        </Checkbox>
      );
    },
    [handleUserSelect],
  );

  const ListActions = useCallback(() => {
    const options = opts(
      <div className="flex">
        <Hyper
          lg
          fullWidth
          destructive
          type="submit"
          end="minus-sign"
          loading={pending}
          onClick={handleRemoveCohost}
          disabled={pending || count === 0}
          label={`Remove ${count > 1 ? `(${count})` : "(1)"}`}
          className={cn("border-t border-macl-red delay-100", {
            "animate-enter": count <= 1,
          })}
        />
        <XndInvite
          list={checked}
          type="COHOST_INVITE"
          updateSentStatus={updateSentStatus}
          createLog={createLog}
          host={vx?.nickname}
        />
      </div>,
      null,
    );
    return (
      <div className="absolute bottom-0 right-0 flex w-fit overflow-hidden rounded-br-md md:min-w-36">
        {options.get(count > 0)}
      </div>
    );
  }, [
    count,
    pending,
    checked,
    createLog,
    vx?.nickname,
    updateSentStatus,
    handleRemoveCohost,
  ]);

  return (
    <div className="space-y-6">
      <div className="grid h-full w-full grid-cols-1 gap-6 px-2 md:grid-cols-5 md:rounded md:px-0">
        <section className="h-fit border-b border-vanilla/20 sm:col-span-3 md:col-span-2 md:h-fit md:border-[0.33px]">
          <Nebula>
            <Form action={action}>
              <div className="mb-8 h-5/6 w-full space-y-6 p-6">
                <BlockHeader label="Host Settings" icon="user-settings" />
                <section className="h-fit rounded bg-gray-400/10 p-2 text-justify text-xs text-chalk lg:p-4 lg:text-sm">
                  You can add co-hosts and event marshals to assist you with
                  ticket-scanning and other guest verification during the event.
                  Fill out the name and email, select access clearances, then
                  click add. You can add multiple co-hosts for this event.
                </section>
                <HyperList
                  data={cohost_info}
                  component={FieldItem}
                  container="space-y-8"
                />
              </div>

              <Clearances
                onChangeFn={handleAccessValuesChange}
                values={clearanceValues}
              />

              <div className="flex h-1/6 w-full items-end justify-between">
                <div className="flex w-full items-center border-t-[0.33px] border-vanilla/20 text-chalk">
                  <div className="flex h-14 w-full items-center justify-between gap-3 border-r-[0.33px] border-vanilla/20 px-3">
                    <p className="font-inter text-xs font-semibold tracking-tight">
                      Confirmed
                    </p>
                    <p className="font-sans text-sm">
                      {
                        cohostList.filter((cohost) => cohost.confirmed === true)
                          .length
                      }
                    </p>
                  </div>
                  <SubmitButton loading={pending} state={onEdit} />
                </div>
              </div>
            </Form>
          </Nebula>
        </section>

        <CohostList cohostList={cohostList}>
          <HyperList
            data={cohostList}
            component={RowItem}
            itemStyle="border-b-[0.33px] flex justify-center w-full py-[8.5px] border-macl-gray"
            keyId="email"
          />
          <ListActions />
        </CohostList>
      </div>
      <div className="h-96 px-2 md:px-0">
        <Reference />
      </div>
    </div>
  );
};

interface SubmitButtonProps {
  loading: boolean;
  state: boolean;
}
const SubmitButton = ({ loading, state }: SubmitButtonProps) => (
  <Hyper
    disabled={loading}
    loading={loading}
    active={state}
    type="submit"
    label={state ? "Update" : "Add"}
    end={state ? "square-arrow-up-right" : "plus-sign"}
    fullWidth
    dark
    xl
  />
);
