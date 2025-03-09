import { describe, test, expect, beforeEach, mock } from "bun:test";
import * as actions from "../actions";

// Mock store
const mockCookieStore = {
  get: mock<any>(() => undefined),
  set: mock<any>(() => undefined),
  delete: mock<any>(() => undefined),
};

// Mock modules
mock.module("next/headers", () => ({
  cookies: () => mockCookieStore,
}));

const mockFetchQuery = mock<any>(() => undefined);
const mockPreloadQuery = mock<any>(() => undefined);
const mockPreloadedQueryResult = mock<any>((data: unknown) => data);

const mockApi = {
  events: {
    get: {
      all: "events:get:all",
      byHostId: "events:get:byHostId",
    },
  },
  users: {
    get: {
      byId: "users:get:byId",
    },
  },
};

mock.module("convex/nextjs", () => ({
  fetchQuery: mockFetchQuery,
  preloadQuery: mockPreloadQuery,
  preloadedQueryResult: mockPreloadedQueryResult,
}));

mock.module("@vx/api", () => ({
  api: mockApi,
}));

describe("Theme actions", () => {
  beforeEach(() => {
    mock.restore();
  });

  test("setTheme sets theme cookie", async () => {
    await actions.setTheme("dark");
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "big-ticket--mode",
      "dark",
      expect.objectContaining({ path: "/" }),
    );
  });

  test("getTheme returns stored theme", async () => {
    mockCookieStore.get.mockReturnValue({ value: "dark" });
    const theme = await actions.getTheme();
    expect(theme).toBe("dark");
  });

  test("getTheme returns light as default", async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    const theme = await actions.getTheme();
    expect(theme).toBe("light");
  });

  test("deleteThemes deletes theme cookie", async () => {
    await actions.deleteThemes();
    expect(mockCookieStore.delete).toHaveBeenCalledWith("big-ticket--mode");
  });
});

describe("User actions", () => {
  beforeEach(() => {
    mock.restore();
  });

  test("setUserID sets user ID cookie", async () => {
    await actions.setUserID("test-id");
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "big-ticket--id",
      "test-id",
      expect.objectContaining({ path: "/" }),
    );
  });

  test("getUserID returns stored ID", async () => {
    mockCookieStore.get.mockReturnValue({ value: "test-id" });
    const id = await actions.getUserID();
    expect(id).toBe("test-id");
  });

  test("getUserID returns null when no ID stored", async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    const id = await actions.getUserID();
    expect(id).toBeNull();
  });

  test("deleteUserID deletes user cookies", async () => {
    await actions.deleteUserID();
    expect(mockCookieStore.delete).toHaveBeenCalledWith("big-ticket--id");
    expect(mockCookieStore.delete).toHaveBeenCalledWith(
      "big-ticket--account-id",
    );
  });
});

describe("Account actions", () => {
  beforeEach(() => {
    mock.restore();
  });

  test("setAccountID sets account ID cookie", async () => {
    await actions.setAccountID("test-account");
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "big-ticket--account-id",
      "test-account",
      expect.objectContaining({ path: "/" }),
    );
  });

  test("getAccountID returns stored account ID", async () => {
    mockCookieStore.get.mockReturnValue({ value: "test-account" });
    const id = await actions.getAccountID();
    expect(id).toBe("test-account");
  });

  test("getAccountID returns null when no ID stored", async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    const id = await actions.getAccountID();
    expect(id).toBeNull();
  });
});

describe("User email actions", () => {
  beforeEach(() => {
    mock.restore();
  });

  test("setUserEmail sets email cookie", async () => {
    await actions.setUserEmail("test@example.com");
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "big-ticket--user-email",
      "test@example.com",
      expect.objectContaining({ path: "/" }),
    );
  });

  test("getUserEmail returns stored email", async () => {
    mockCookieStore.get.mockReturnValue({ value: "test@example.com" });
    const email = await actions.getUserEmail();
    expect(email).toBe("test@example.com");
  });

  test("getUserEmail returns null when no email stored", async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    const email = await actions.getUserEmail();
    expect(email).toBeNull();
  });
});

describe("Event actions", () => {
  beforeEach(() => {
    mock.restore();
  });

  test("fetchAllEvents calls fetchQuery with correct arguments", async () => {
    await actions.fetchAllEvents();
    expect(mockFetchQuery).toHaveBeenCalledWith(mockApi.events.get.all);
  });

  test("preloadAllEvents calls preloadQuery with correct arguments", async () => {
    await actions.preloadAllEvents();
    expect(mockPreloadQuery).toHaveBeenCalledWith(mockApi.events.get.all);
  });

  test("fetchUser returns null when no user ID exists", async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    const user = await actions.fetchUser();
    expect(user).toBeNull();
  });
});
