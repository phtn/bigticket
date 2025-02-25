import type { Id } from "@vx/dataModel";
import type {
  Cohost,
  EventGallery,
  InsertEvent,
  SelectEvent,
  UserTicket,
  VIP,
} from "convex/events/d";
import type { InsertUser, SelectUser, UpdateUser } from "convex/users/d";

export interface DConvexCtxValues {
  usr: {
    create: (args: InsertUser) => Promise<Id<"users"> | null>;
    get: {
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
    update: {
      status: (id: string, is_active: boolean) => Promise<Id<"events"> | null>;
      cover_url: (id: string, cover_url: string) => Promise<string | null>;
      photo_url: (id: string, photo_url: string) => Promise<string | null>;
      isCoverLight: (
        id: string,
        is_cover_light: boolean,
      ) => Promise<string | null>;
      views: (id: string) => Promise<string | null>;
      vip: (id: string, vip: VIP) => Promise<string | null>;
      coHost: (id: string, cohost: Cohost) => Promise<string | null>;
      mediaGallery: (id: string, media: EventGallery) => Promise<string | null>;
    };
  };

  files: {
    create: (file?: File) => Promise<string | null>;
    get: (storageId: string | undefined) => Promise<string | null>;
  };
  createvx: () => Promise<string | null>;
  // getUserById: (id: string) => SelectUser | null;
  getEventById: (id: string) => SelectEvent | null;
  getEventsByIds: (ids: string[]) => SelectEvent[] | undefined;
  getAllEvents: () => SelectEvent[] | undefined;
  getEventsByHostId: (id: string) => SelectEvent[] | undefined;
}
