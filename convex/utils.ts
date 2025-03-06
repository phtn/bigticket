import { Doc, TableNames } from "@vx/dataModel";
import { DatabaseReader, QueryCtx } from "@vx/server";
import { v, Validator } from "convex/values";

export const upsert = <T extends Record<K, any>, K extends keyof T>(
  arr: T[],
  item: T,
  keyField: K,
  updateFields: (keyof T)[],
): T[] => {
  const map = new Map();
  arr.forEach((element, index) => map.set(element[keyField], index));

  const existingIndex = map.get(item[keyField]);

  if (existingIndex !== undefined) {
    updateFields.forEach((field) => {
      arr[existingIndex]![field] = item[field];
    });
  } else {
    arr.push(item);
  }

  // Optional: if filtering is needed
  // Return the filtered array based on a condition function
  return arr;
};

export const betterV = {
  mergeObjects: <
    O1 extends Record<string, any>,
    O2 extends Record<string, any>,
  >(
    validator1: Validator<O1, "required", any>,
    validator2: Validator<O2, "required", any>,
  ): Validator<Omit<O1, keyof O2> & O2, "required", any> => {
    if (validator1.kind !== "object" || validator2.kind !== "object") {
      throw new Error("Not object validators");
    }
    return v.object({
      ...validator1.fields,
      ...validator2.fields,
    }) as any;
  },
};

export async function doc<T extends TableNames>(
  db: DatabaseReader,
  tableName: T,
  id: string,
) {
  return await db
    .query(tableName)
    .filter((q) => q.eq("event_id", id))
    .first();
}

export async function getEvent(
  ctx: QueryCtx,
  id: string,
): Promise<Doc<"events"> | null> {
  return await ctx.db
    .query("events")
    .withIndex("by_event_id", (q) => q.eq("event_id", id))
    .first();
}
