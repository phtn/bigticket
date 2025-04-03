import { createCallerFactory, router } from "@/server/api/trpc";
import { paymongo } from "./routers/paymongo";
import { base } from "./routers/base";
import { resendRouter } from "./routers/resend";

export const appRouter = router({
  paymongo,
  base,
  email: resendRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
