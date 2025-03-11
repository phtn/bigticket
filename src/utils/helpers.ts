import type { Dispatch, ReactElement, SetStateAction } from "react";
import { onError, onSuccess, onWarn } from "@/app/ctx/toast";
import pkg from "../../package.json";
import toast from "react-hot-toast";
import chalk from "chalk";

export const getVersion = () => {
  return pkg.version;
};

export const deg2Rad = (deg: number | string): number => {
  const getRad = (d: number) => (d * Math.PI) / 180;

  if (typeof deg === "string") {
    const parsed = parseInt(deg);
    return getRad(parsed);
  }

  return getRad(deg);
};

export const rawUriDecoder = <T>(params: T) => {
  return Object.entries(params as Record<string, string>).map(
    ([key, value]) => ({
      [key]: decodeRaw(encodeURIComponent(value ?? "")),
    }),
  );
};

const decodeRaw = (encoded: string) => {
  let val = encoded.replace(/%20/g, "__P__");
  val = decodeURIComponent(val);
  return val.replace(/__P__/g, "+");
};

export const passwordSecure = (name: string, secure: boolean) => {
  if (name === "email") return "email";
  if (name === "password" && secure) {
    return "password";
  }
  return "text";
};

export const removeLastEqualSign = (str: string) => {
  const regex = /=+$/;
  return str.replace(regex, "");
};

export const hashString = async (...args: string[]): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(args.join(""));

  return crypto.subtle.digest("SHA-256", data).then((hash) => {
    const encoded = btoa(
      String.fromCharCode.apply(null, Array.from(new Uint8Array(hash))),
    );
    const sanitizedHash = encoded
      .replace(/\+/g, "")
      .replace(/\//g, "")
      .replace(/=+$/, "");
    return removeLastEqualSign(sanitizedHash);
  });
};

export const createRefNo = async (
  ...args: Array<string | undefined>
): Promise<string> => {
  if (args.every((arg) => arg !== undefined)) {
    return `${await hashString(...args)}`;
  } else {
    return `${await hashString(new Date().getTime().toString(36))}`;
  }
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

export function mapUnion<T extends string | number | symbol>() {
  return {
    // Record<[K in T], V> Record<keyof T, V>
    build: <V>(entries: Record<T, V>): Map<T, V> => {
      const map = new Map<T, V>();
      (Object.entries(entries) as [T, V][]).forEach(([key, value]) => {
        map.set(key, value);
      });
      return map;
    },
  };
}

export const decimal = (
  num: string | number | undefined,
  digits: number,
): string => {
  if (num === undefined) return "0.00";
  const parsedNumber = typeof num === "string" ? parseFloat(num) : num;
  return parsedNumber.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

export const prettyDate = (datestring: string | undefined): string => {
  if (!datestring) return "";
  const date = new Date(datestring);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "UTC",
  };
  return date.toLocaleString("en-US", options);
};

export const getToday = () => {
  const d = new Date();
  const datestring = d.toLocaleDateString();
  const date = prettyDate(datestring).split("at");
  return date[0];
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

export const getNextElement = <T>(
  array: T[],
  currentIndex: number,
  setState: Dispatch<SetStateAction<number>>,
) => {
  const nextIndex = (currentIndex + 1) % array.length; // Calculate the next index with wrap-around
  setState(nextIndex);
  return nextIndex;
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

export const withSpaces = (input: string): string => {
  return input.replace(/_/g, " ");
};

const adj: string[] = [
  "Magnetic",
  "Spinning",
  "Perturbed",
  "Excited",
  "Coherent",
  "Super",
  "Observant",
  "Wavelike",
  "Dual",
  "Tunneling",
  "Computing",
  "Collective",
  "Orbital",
  "Proto",
  "Meta",
  "Fast",
  "Sonic",
  "Blazing",
  "The Great",
];

const moons: string[] = [
  "Moon",
  "Phobos",
  "Deimos",
  "Io",
  "Europa",
  "Ganymede",
  "Callisto",
  "Mimas",
  "Enceladus",
  "Tethys",
  "Dione",
  "Rhea",
  "Titan",
  "Hyperion",
  "Iapetus",
  "Miranda",
  "Ariel",
  "Umbriel",
  "Titania",
  "Oberon",
  "Triton",
  "Nereid",
  "Charon",
  "Styx",
  "Nix",
  "Kerberos",
  "Hydra",
  "Messier",
  "Eradani",
  "Attractor",
  "Hyperspace",
];

export const nameGenerator = (): string => {
  const radj = Math.floor(Math.random() * adj.length);
  const noun = Math.floor(Math.random() * moons.length);

  return `${adj[radj]} ${moons[noun]}`;
};

export const getMonthAndYear = (
  timeInMs: number,
): { month: string; year: number } => {
  const date = new Date(timeInMs);
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return { month, year };
};

export const authHandler =
  <T extends Error>(
    setLoading: Dispatch<SetStateAction<boolean>>,
    setError?: Dispatch<SetStateAction<T>>,
  ) =>
  (e: T) => {
    onError(
      e.message.includes("auth/invalid-credential")
        ? "Invalid Credentials"
        : e.message,
    );
    setLoading(false);
    if (setError) setError(e);
  };

export const okHandler =
  (setLoading: Dispatch<SetStateAction<boolean>>, message?: string) => () => {
    setLoading(false);
    onSuccess(`${message}`);
  };

export const settle = (setLoading: Dispatch<SetStateAction<boolean>>) => () => {
  setLoading(false);
};

export const warnHandler =
  <T extends Error>(
    setLoading: Dispatch<SetStateAction<boolean>>,
    setError?: Dispatch<SetStateAction<T>>,
  ) =>
  (e: T) => {
    onWarn(
      e.message.includes("auth/invalid-credential")
        ? "Invalid Credentials"
        : e.message,
    );
    setLoading(false);
    if (setError) setError(e);
  };

export const sanitizeText = (value: string) => {
  const spaces = value.replaceAll(" ", "_");
  const commas: string = spaces.replaceAll(",", "");
  return commas;
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

export const basedOnTime = (): string => {
  const date = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localDate = new Date(
    date.toLocaleString("en-US", { timeZone: timezone }),
  );

  const hours = localDate.getHours();

  if (hours < 12) {
    return "Good day,";
  }

  if (hours >= 12 && hours < 17) {
    return "Good afternoon,";
  }

  if (hours >= 17 && hours < 20) {
    return "Good evening,";
  }

  return "Good evening,";
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

export const svgToPath = (svg: string) => {
  const p0 = svg.indexOf('d="');
  const p1 = svg.indexOf('"', p0 + 3);
  return svg.substring(p0 + 3, p1);
};

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

export const normalizeTitle = (title: string | undefined) => {
  if (!title) return [];
  const words = title.split(" ");

  if (words.length < 2) return [title];

  const firstLine = words[0];
  let secondLine = words[1];
  const thirdLine = words[2];

  if (thirdLine) {
    secondLine = secondLine + " " + thirdLine;
  }

  return [firstLine, secondLine];
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
