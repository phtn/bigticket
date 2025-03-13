import { createCallerFactory, router } from "@/server/api/trpc";
import { paymongo } from "./routers/paymongo";
import { base } from "./routers/base";

export const appRouter = router({
  paymongo,
  base,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
