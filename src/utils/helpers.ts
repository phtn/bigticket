import type { Dispatch, ReactElement, SetStateAction } from "react";
import { onError, onSuccess, onWarn } from "@/app/ctx/toast";
import pkg from "../../package.json";
import toast from "react-hot-toast";
import chalk from "chalk";

export const getVersion = () => {
  return pkg.version;
};

export const formatMobile = (mobile_number: string) => {
  const regex = /^0|^(63)|\D/g;
  if (mobile_number) {
    const formattedNumber = mobile_number.replace(regex, "");
    return `+63${formattedNumber}`;
  }
  return "";
};

export const opts = (...args: (ReactElement | null)[]) => {
  return new Map([
    [true, args[0]],
    [false, args[1]],
  ]);
};

export type CopyFnParams = {
  name: string;
  text: string;
  limit?: number;
};
type CopyFn = (params: CopyFnParams) => Promise<boolean>; // Return success

export const charLimit = (
  text: string | undefined,
  chars?: number,
): string | undefined => {
  if (!text) return;
  return text.substring(0, chars ?? 35);
};

export const copyFn: CopyFn = async ({ name, text }) => {
  if (!navigator?.clipboard) {
    onWarn("Clipboard not supported");
    return false;
  }
  if (!text) return false;

  return await navigator.clipboard
    .writeText(text)
    .then(() => {
      onSuccess(`${name ? "Copied: " + name : "Copied."}`);
      return true;
    })
    .catch((e) => {
      onError(`Copy failed. ${e}`);
      return false;
    });
};

export const getFileType = (file_type: string | undefined): string => {
  if (!file_type) {
    return "";
  }
  const re = /\/(\w+)$/;
  const match = re.exec(file_type);
  return match?.[1] ?? "";
};

export const getFileSize = (bytes: number | undefined): string => {
  const units = ["bytes", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;

  if (!bytes) {
    return "";
  }

  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }

  const roundedValue = unitIndex > 1 ? bytes.toFixed(2) : Math.round(bytes);

  return `${roundedValue} ${units[unitIndex]}`;
};

export const okHandler =
  (setLoading: Dispatch<SetStateAction<boolean>>, message?: string) => () => {
    setLoading(false);
    onSuccess(`${message}`);
  };

export const settle = (setLoading: Dispatch<SetStateAction<boolean>>) => () => {
  setLoading(false);
};

type FullnameParams = {
  firstName: string | undefined;
  middleName: string | undefined;
  lastName: string | undefined;
};
export const createFullname = (params: FullnameParams) => {
  const { firstName, middleName, lastName } = params;
  if (!middleName) {
    return `${firstName} ${lastName}`;
  }
  return `${firstName} ${middleName} ${lastName}`;
};

export const getInitials = (name: string | undefined) => {
  if (!name) return;

  const words = name.split(" ");

  if (words.length === 1) {
    return name.slice(0, 2);
  }

  if (words.length === 2) {
    return words[0]!.charAt(0) + words[1]!.charAt(0);
  }

  if (words.length >= 3) {
    return words[0]!.charAt(0) + words[words.length - 1]!.charAt(0);
  }
};

export const charlimit = (
  text: string | undefined,
  chars?: number,
): string | undefined => {
  if (!text) return;
  return text.substring(0, chars ?? 12);
};

export type MonthName =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export function getPreviousMonths(): (MonthName | undefined)[] {
  const today: Date = new Date();
  let currentMonth: number = today.getMonth(); // Get current month (0-11)
  const previousMonths: number[] = [];

  // Calculate and push the current month
  previousMonths.push(currentMonth);

  // Calculate and push the previous three months
  for (let i = 1; i <= 3; i++) {
    currentMonth--;
    if (currentMonth < 0) {
      // Handle wrap-around to previous year
      currentMonth += 12;
      today.setFullYear(today.getFullYear() - 1); // Adjust the year
    }
    previousMonths.unshift(currentMonth);
  }

  // Convert month numbers to month names
  const monthNames: MonthName[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return previousMonths.map((month) => monthNames[month]);
}

const s = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

export const guid = () =>
  `${s()}${s()}-${s()}-${s()}-${s()}-${s()}${s()}${s()}`;

export const errHandler =
  <T>(
    setLoading: Dispatch<SetStateAction<boolean>>,
    setError?: Dispatch<SetStateAction<T>>,
  ) =>
  (e: T) => {
    onError("Panic!");
    setLoading(false);
    if (setError) setError(e);
  };

export const Err =
  <T extends Error | null | undefined>(
    setLoading: Dispatch<SetStateAction<boolean>>,
    msg?: string,
  ) =>
  (e: T) => {
    onError(msg ?? `Error: ${e?.name}`);
    setLoading(false);
  };

export const Ok =
  (setLoading: Dispatch<SetStateAction<boolean>>, ...args: string[]) =>
  () => {
    setLoading(false);
    onSuccess(`${args[0]} ${args[1] ?? ""}`);
  };

export const onSettle =
  (setLoading: Dispatch<SetStateAction<boolean>>) => () => {
    setLoading(false);
  };

export const excludeProp = <T extends object>(o: T, ...keys: string[]) => {
  const ex = new Set(keys);
  return Object.fromEntries(Object.entries(o).filter(([k]) => !ex.has(k)));
};

export const pasteFn = async (id: string) => {
  const inputEl = document.getElementById(id) as HTMLInputElement;
  const text = await navigator.clipboard.readText();
  inputEl.value = text.trim();
  const v = inputEl.value;
  if (v.includes('"')) {
    v.replaceAll('"', "");
  }
  return v;
};

export const asyncR = async <T extends Promise<T>>(
  promise: Promise<T> | (() => Promise<T> | T) | T[] | T,
  loading?: string,
  success?: string,
  error?: string,
) => {
  try {
    const result = Array.isArray(promise)
      ? Promise.all(promise)
      : Promise.resolve(promise);

    await toast.promise(async () => await result, {
      loading: loading ?? "Loading...",
      success: success ?? "Successful!",
      error: error ?? "An error occurred",
    });

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const clearConsole = () => {
  const big = chalk.hex("#59D2CB").bold.bgBlack;
  const ticket = chalk.hex("#fb923c").bold.bgBlack;
  const cutout = chalk.gray.bgBlack.bold("●");
  console.clear();
  console.log(cutout + big(" BIG ") + ticket("ticket ") + cutout);
};

export function formatAsMoney(value: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: value !== Math.floor(value) ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(value).replace("PHP", "X");
}
