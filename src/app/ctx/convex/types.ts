import type { Id } from "@vx/dataModel";
import type {
  InsertEvent,
  SelectEvent,
  UserTicket,
  VIP,
} from "convex/events/d";
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
      photo_url: (id: string, photo_url: string) => Promise<Id<"users"> | null>;
      likes: (id: string, target_id: string) => Promise<string | null>;
      bookmarks: (id: string, target_id: string) => Promise<string | null>;
      followers: (id: string, target_id: string) => Promise<string | null>;
      following: (id: string, target_id: string) => Promise<string | null>;
      tickets: (id: string, tickets: UserTicket[]) => Promise<string | null>;
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
    update: {
      status: (id: string, is_active: boolean) => Promise<Id<"events"> | null>;
      cover_url: (
        id: string,
        cover_url: string,
      ) => Promise<string | null>;
      photo_url: (
        id: string,
        photo_url: string,
      ) => Promise<string | null>;
      isCoverLight: (id: string, is_cover_light: boolean) => Promise<string | null>;
      views: (id: string) => Promise<string | null>;
      vip: (id: string, vip: VIP) => Promise<string | null>;
    };
  };

  files: {
    create: (file?: File) => Promise<string | null>;
    get: (storageId: string | undefined) => Promise<string | null>;
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
