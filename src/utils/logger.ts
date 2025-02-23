import chalk from "chalk";

type DataType =
  | null
  | undefined
  | boolean
  | number
  | string
  | bigint
  | symbol
  | object
  | Array<number | string | object>;

type Classifiable = DataType;

export const log = (label: string, data: Classifiable) => {
  const stack = new Error().stack;
  const lines = stack?.split("\n");
  const fn = lines?.[2]?.match(/at (\S+)/)?.[1] ?? "anon";

  const kind = classifier(data);

  const c1 = chalk.hex("#a5b4fc");
  const c2 = chalk.hex("#fef3c7");
  // const c3 = chalk.hex("#bae6fd");
  const c4 = chalk.hex(kind.color).bold;
  const c5 = chalk.reset();
  const c6 = chalk.hex("#71717a");
  const c7 = chalk.hex(kind.isFalsy ? "#ec4899" : "#d9f99d");

  const labels =
    c6(" ➜ ") + c2(label.split(",")?.forEach((str) => str) ?? label);

  const ctx =
    c1(`𝒇(𝒙)`) +
    c6("[") +
    c1(fn) +
    labels +
    c6("●") +
    c6("") +
    c4(kind.type) +
    c6("") +
    c6("●") +
    c7(`${kind.isFalsy ? "falsy" : "truthy"} `) +
    c5;

  if (typeof data === "object") {
    console.log(ctx);
    console.table(data);
  } else {
    console.log(ctx, data);
  }
};

const colors: Record<string, string> = {
  null: "#fed7aa",
  undefined: "#fecaca",
  number: "#bae6fd",
  string: "#d9f99d",
  array: "#86efac",
  integer: "#3b82f6",
  boolean: "#c7d2fe",
  object: "#bfdbfe",
  symbol: "#f5d0fe",
  function: "#99f6e4",
  bigint: "#fbcfe8",
  float: "#bae6fd",
  NaN: "#fecdd3",
  unknown: "#6b7280",
};

// const colors_gpt = {
//   null: "#94a3b8",
//   undefined: "#d1d5db",
//   boolean: "#22c55e",
//   integer: "#3b82f6",
//   float: "#60a5fa",
//   bigint: "#8b5cf6",
//   string: "#f43f5e",
//   array: "#ec4899",
//   object: "#10b981",
//   function: "#f59e0b",
//   symbol: "#eab308",
//   NaN: "#e11d48",
//   unknown: "#6b7280",
// };

function classifier(value: Classifiable) {
  let type;
  let isFalsy = false;

  if (value === null) {
    type = "null";
    isFalsy = true;
  } else if (typeof value === "undefined") {
    type = "undefined";
    isFalsy = true;
  } else if (typeof value === "number") {
    if (isNaN(value)) {
      type = "NaN";
      isFalsy = true;
    } else {
      type = Number.isInteger(value) ? "integer" : "float";
      isFalsy = value === 0;
    }
  } else if (typeof value === "boolean") {
    type = "boolean";
    isFalsy = !value;
  } else if (typeof value === "bigint") {
    type = "bigint";
  } else if (typeof value === "string") {
    type = "string";
    isFalsy = value === ("" as string);
  } else if (Array.isArray(value)) {
    type = "array";
    if (typeof value === "object" && "length" in value) {
      isFalsy = value.length === 0;
    }
  } else if (typeof value === "object") {
    type = "object";
  } else if (typeof value === "function") {
    type = "function";
  } else if (typeof value === "symbol") {
    type = "symbol";
  } else {
    type = "unknown";
  }

  // Get the corresponding color, default to a fallback
  const color = colors[type] ?? colors.unknown!;

  return { isFalsy, type, color };
}
