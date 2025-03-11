import { Toaster, ToastBar } from "react-hot-toast";

import { toast } from "react-hot-toast";
import { Button } from "@nextui-org/react";
import { Icon } from "@/icons";

export const barToast = () => (
  <Toaster>
    {(t) => (
      <ToastBar toast={t}>
        {() => (
          <>
            <Icon name="Fire" className="text-red-500" />
            <p>Butt fuck yea!</p>
            {t.type !== "loading" && (
              <Button variant="shadow" color="primary">
                Close
              </Button>
            )}
          </>
        )}
      </ToastBar>
    )}
  </Toaster>
);

export const onSuccess = (msg: string) => toast.success(msg);
export const onInfo = (msg: string) =>
  toast(msg, {
    icon: <Icon name="InfoLine" className="size-5 text-sky-300" />,
    style: {
      padding: "8px 12px",
      backgroundColor: "#191818",
      color: "white",
      letterSpacing: "-0.50px",
      fontSize: "14px",
    },
  });
export const onWarn = (msg: string) =>
  toast(msg, {
    icon: <Icon name="AlertTriLine" className="size-5 text-orange-400" />,
    style: {
      padding: "8px 12px",
      backgroundColor: "#191818",
      color: "white",
      letterSpacing: "-0.50px",
      fontSize: "14px",
    },
  });

export const onError = (msg: string) => toast.error(msg);

export const onLoading = (msg: string) => toast.loading(msg);

export const Toasts = () => {
  return (
    <Toaster
      gutter={10}
      toastOptions={{
        position: "top-right",
        duration: 4000,
        success: {
          style: {
            background: "#191818",
            padding: "8px 12px",
            color: "white",
            letterSpacing: "-0.50px",
            fontSize: "14px",
          },
          iconTheme: {
            primary: "#10b981",
            secondary: "#d1fae5",
          },
        },
        error: {
          style: {
            background: "#191818",
            padding: "8px 12px",
            color: "white",
            letterSpacing: "-0.50px",
            margin: "2px 0px",
            fontSize: "12px",
          },
        },
        loading: {
          style: {
            background: "#191818",
            padding: "8px 12px",
            color: "white",
            letterSpacing: "-0.50px",
            fontSize: "12px",
          },
          iconTheme: {
            primary: "#fde68a",
            secondary: "#52525b",
          },
        },
      }}
    />
  );
};
