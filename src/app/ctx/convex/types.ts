import type { Id } from "@vx/dataModel";
import type { InsertEvent, SelectEvent } from "convex/events/d";
import type { InsertUser, SelectUser, UpdateUser } from "convex/users/d";

export interface ConvexCtxValues {
  usr: {
    create: (args: InsertUser) => Promise<Id<"users"> | null>;
    get: {
      byId: (id: string) => Promise<SelectUser | null>;
      byEmail: (email: string) => Promise<SelectUser | null>;
      byAccountId: (account_id: string) => Promise<SelectUser | null>;
      byRole: (role: string[]) => Promise<SelectUser[]>;
    };

    update: {
      info: (args: UpdateUser) => Promise<Id<"users"> | null>;
      status: (id: string, is_active: boolean) => Promise<Id<"users"> | null>;
      role: (id: string, role: string) => Promise<Id<"users"> | null>;
    };
    add: {
      metadata: (
        id: string,
        record: Record<string, number | string | boolean>,
      ) => Promise<Id<"users"> | null>;
    };
  };

  events: {
    create: (event: InsertEvent) => Promise<Id<"events"> | null>;
    get: {
      all: () => SelectEvent[] | undefined;
      byId: (id: string) => Promise<SelectEvent | null>;
      byHostId: (id: string) => Promise<SelectEvent[] | undefined>;
    };
  };

  files: {
    create: (file?: File) => Promise<string | null>;
    get: (storageId: string) => Promise<string | null>;
  };
  createvx: () => Promise<string | null>;

  // logs: {
  //   create: (
  //     args: InsertLog,
  //   ) => Promise<(string & { __tableName: "logs" }) | null>;
  //   get: {
  //     byId: (id: string) => Promise<SelectLog[] | null>;
  //   };
  // };
}
