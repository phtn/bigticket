import { useConvexCtx } from "@/app/ctx/convex";
import { onSuccess, onWarn } from "@/app/ctx/toast";
import { Hyper } from "@/ui/button/button";
import { HyperList } from "@/ui/list";
import { Err, getInitials, opts } from "@/utils/helpers";
import { Checkbox, CheckboxGroup, Form, Input, User } from "@nextui-org/react";
import type { Cohost, CohostClearance } from "convex/events/d";
import {
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { inputClassNames } from "../../../editor";
import { BlockHeader } from "../components";
import { type CohostField, CohostZod } from "../schema";
import { Nebula } from "../";
import { useConvexUtils } from "@/app/ctx/convex/useConvexUtils";
import { cn } from "@/lib/utils";
import { cohostReducer, initialCohostState } from "./reducer";
import type { CohostContentProps, CohostWithDefaults } from "./types";
import { checkedState, getCheckedKeys, updateProps } from "../utils";
import toast from "react-hot-toast";
import { Iconx } from "@/icons/icon";

export const HostSettings = ({ xEvent, user_id }: CohostContentProps) => {
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const cohost_info: CohostField[] = useMemo(
    () => [
      {
        name: "name",
        type: "text",
        label: "Name",
        placeholder: "Name of the co-host",
        value: formValues.name,
        required: false,
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        value: formValues.email,
        placeholder: "Email receiving the invitation",
        required: true,
      },
    ],
    [formValues],
  );

  const { vxEvents } = useConvexCtx();
  const updateEventCohost = useCallback(
    async (id: string, cohost: Cohost) => {
      await vxEvents.mut.updateEventCohost({ id, cohost });
    },
    [vxEvents.mut],
  );
  const { q } = useConvexUtils();

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
              "flex items-center relative min-w-full justify-between p-4",
              "hover:bg-vanilla/5 rounded-sm cursor-pointer",
            ),
            label: "flex items-center tracking-tight w-full max-w-full",
            icon: "text-primary",
            wrapper: "ml-4",
          }}
          isSelected={cohost.checked}
          onValueChange={handleChangeSelected}
        >
          <div
            className={cn(
              "absolute -left-12 top-0 z-10 font-sans text-[10px] text-vanilla opacity-40",
              { "text-teal-400 opacity-100": cohost.checked },
            )}
          >
            {cohost.idx}
          </div>
          <div className="flex w-full items-center justify-between ps-2 md:ps-0">
            <User
              classNames={{
                name: "whitespace-nowrap font-semibold text-chalk text-xs font-inter",
              }}
              avatarProps={{
                size: "sm",
                fallback: getInitials(cohost.name)?.toUpperCase(),
                className:
                  "text-[16px] hidden overflow-hidden md:flex ml-2 mr-1 bg-macd-orange/50 rounded-md border-vanilla/20 text-vanilla/90 flex-grow-0 font-semibold",
              }}
              description={
                <p className="font-inter text-tiny text-vanilla/80">
                  {cohost.email}
                </p>
              }
              name={cohost.name}
            />
          </div>

          <div className="flex items-center justify-end whitespace-nowrap text-chalk">
            <div className="flex w-14 items-center justify-center gap-[1.5px] text-sm font-medium text-vanilla md:w-20">
              <span className="font-sans">cleareances...</span>
            </div>
            <div
              className={cn(
                "flex w-14 items-center justify-center gap-[1.5px] text-xs font-semibold tracking-tighter text-vanilla/40 md:w-28 md:justify-end",
                {
                  "text-teal-400": cohost.invitation_sent,
                },
              )}
            >
              {cohost.invitation_sent ? "Sent" : "Not Sent"}
              <Iconx
                name="check"
                className={cn("hidden size-2.5", {
                  flex: cohost.invitation_sent,
                })}
              />
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
          end="minus-sign"
          destructive
          type="submit"
          loading={pending}
          onClick={handleRemoveCohost}
          disabled={pending || count === 0}
          label={`Remove ${count > 1 ? `(${count})` : "(1)"}`}
          className={cn("delay-100", { "animate-enter": count <= 1 })}
        />
        {/* <SendInvite vip_list={checked} updateSentStatus={updateSentStatus} /> */}
      </div>,
      null,
    );
    return (
      <div className="absolute bottom-[0.77px] right-[0.77px] flex w-fit overflow-hidden rounded-br-md md:min-w-36">
        {options.get(count > 0)}
      </div>
    );
  }, [count, pending, handleRemoveCohost]);

  return (
    <Nebula>
      <Form action={action}>
        <div className="grid h-full w-full grid-cols-1 md:grid-cols-5 md:gap-0 md:rounded">
          <section className="h-fit border-b border-vanilla/20 sm:col-span-3 md:col-span-2 md:h-fit md:border-[0.33px]">
            <div className="mb-8 h-5/6 w-full space-y-6 p-6">
              <BlockHeader label="Host Settings" icon="user-settings" />
              <section className="-mx-6 h-fit rounded-sm bg-teal-300/20 px-4 py-3 text-justify text-tiny text-vanilla md:p-4 md:text-sm">
                You can add co-hosts and event marshals to assist you with
                ticket-scanning and other guest verification during the event.
                Fill out the name and email, select access clearances, then
                click add. You can add multiple co-hosts for this event.
              </section>
              <div className="space-y-8">
                {cohost_info.map((field) => (
                  <Input
                    key={field.name}
                    id={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    onChange={handleInputChange}
                    classNames={inputClassNames}
                    placeholder={field.placeholder}
                    isRequired={field.required}
                    value={field.value}
                    validationBehavior="native"
                    className="appearance-none"
                    isClearable
                  />
                ))}
              </div>
            </div>

            <div className="flex h-fit w-full border-t-[0.33px] border-vanilla/20 px-6 py-8 backdrop-blur-sm lg:px-4 xl:px-6">
              <CheckboxGroup
                onValueChange={handleAccessValuesChange}
                value={getCheckedKeys(clearanceValues)}
                label="Select Access clearances"
                orientation="horizontal"
                color="primary"
                description="Choose co-host access clearances for this event."
                className="w-full"
                classNames={{
                  wrapper: "",
                  base: "w-full",
                  label:
                    "text-white pb-4 font-bold w-full text-lg font-inter tracking-tighter",
                  description: "text-chalk/60 text-xs pt-4",
                }}
              >
                <HyperList
                  data={Object.entries(clearanceValues).map((c) => c)}
                  component={ClearanceItem}
                  container="flex flex-col lg:flex-row xl:space-x-5 lg:space-x-2 whitespace-nowrap space-y-2 lg:space-y-0 w-full justify-between xl:justify-start"
                  itemStyle="xl:py-1.5 ps-1.5 pe-2 border-0 lg:w-fit w-full overflow-hidden rounded-xl hover:bg-primary/35 hover:border-chalk/20"
                />
              </CheckboxGroup>
            </div>

            <div className="flex h-1/6 w-full items-end justify-between">
              <div className="flex w-full items-center border-t-[0.33px] border-vanilla/20 text-chalk">
                <div className="flex h-14 w-full items-center justify-between gap-3 border-r-[0.33px] border-vanilla/20 px-3">
                  <p className="font-inter text-xs font-semibold tracking-tight">
                    Confirmed
                  </p>
                  <p className="font-sans text-sm">0</p>
                </div>
                <Hyper
                  disabled={pending}
                  loading={pending}
                  active={onEdit}
                  type="submit"
                  label={onEdit ? "Update" : "Add"}
                  end={onEdit ? "square-arrow-up-right" : "plus-sign"}
                  fullWidth
                  dark
                  xl
                />
              </div>
            </div>
          </section>

          <CohostList cohostList={cohostList}>
            <HyperList
              data={cohostList}
              component={RowItem}
              container=""
              keyId="email"
            />
            <ListActions />
          </CohostList>
        </div>
      </Form>
    </Nebula>
  );
};

interface CohostListProps {
  cohostList: CohostWithDefaults[];
  children: ReactNode;
}

const CohostList = ({ cohostList, children }: CohostListProps) => {
  return (
    <section className="relative border-vanilla/20 text-chalk md:col-span-3 md:border-y md:border-r">
      <div className="h-96 w-full overflow-hidden overflow-y-scroll">
        <div className="flex h-11 w-full items-center justify-between border-b-3 border-vanilla/20 px-3 font-inter text-tiny font-bold">
          <div className="flex w-full items-center justify-between gap-6 md:justify-start">
            <span>Co-host List</span>
            <span className="font-sans font-normal">{cohostList.length}</span>
          </div>
        </div>
        {children}
      </div>
      <div className="absolute bottom-2 right-2">
        {/* <Hyper cohost_list={xEvent?.cohost_list} /> */}
      </div>
    </section>
  );
};

const ClearanceItem = (props: [string, boolean]) => {
  return (
    <Checkbox
      name={props[0]}
      color={
        props[0] === "scan_code"
          ? "secondary"
          : props[0] === "add_vip"
            ? "warning"
            : "danger"
      }
      className="flex data-[selected=true]:bg-primary/30"
      classNames={{
        base: "flex max-w-lg h-14 md:max-w-none px-3",
        label:
          "text-chalk flex w-full capitalize text-sm tracking-tighter font-medium",
        icon: "stroke-2 size-5 text-white",
        wrapper: "",
      }}
      value={props[0]}
    >
      <div className="flex w-full">{props[0].replaceAll("_", " ")}</div>
    </Checkbox>
  );
};
