import { createCallerFactory, router } from "@/server/api/trpc";
import { paymongo } from "./routers/paymongo";
import { baseRouter } from "./routers/base";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  paymongo,
  base: baseRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
