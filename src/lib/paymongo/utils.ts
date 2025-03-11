import type { ZodObject, ZodRawShape } from "zod";
import { proc as p } from "@/server/api/trpc";

// Procedure Generator
export const procedure = <T extends ZodRawShape>(schema: ZodObject<T>) =>
  p.input(schema);

export const queryAll = () => p;

/** async/await wrapper */
export const asyncFn =
  <TParams, TReturn>(fn: (params: TParams) => Promise<TReturn>) =>
  async (params: TParams) =>
    await fn(params);

/** Async/Await tRPC */
interface RParams<T> {
  input: T;
}

export const asyncR =
  <TParams, TReturn>(fn: (params: TParams) => Promise<TReturn>) =>
  async ({ input }: RParams<TParams>) =>
    await fn(input);

export const asyncRx =
  <TParams, TReturn>(fn: (params: TParams) => Promise<TReturn>) =>
  async ({ input }: RParams<TParams>) => {
    const result = await fn(input);
    return JSON.stringify(result);
  };

export const asyncArr =
  <TParams, TReturn>(fn: (params: TParams) => Promise<TReturn[]>) =>
  async ({ input }: RParams<TParams>) =>
    await fn(input);
