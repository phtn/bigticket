import { useMutation, useQuery } from "convex/react";
import type {
  FunctionArgs,
  FunctionReturnType,
  OptionalRestArgs,
  FunctionReference,
  DefaultFunctionArgs,
} from "convex/server";
import { type AnyFunctionReference } from "node_modules/convex/dist/esm-types/server/api";

export const useConvexUtils = () => {
  const q = <T>(arg: T | undefined) => (arg as T) ?? ("skip");
  const qs = <T>(args: (T | undefined)[]) => (args as T[]) ?? "skip";

  const asyncFn =
    <TParams, TReturn>(fn: (params: TParams) => Promise<TReturn>) =>
    async (params: TParams) =>
      (await fn(params)) as Promise<TReturn>;

  type ConvexFunction<
    T extends "query" | "mutation",
    P extends DefaultFunctionArgs,
    R extends FunctionReturnType<AnyFunctionReference>,
  > = FunctionReference<T, "public", P, R>;
  type QueryFunction<
    P extends DefaultFunctionArgs,
    R extends FunctionReturnType<AnyFunctionReference>,
  > = ConvexFunction<"query", P, R>;
  type MutationFunction<
    P extends DefaultFunctionArgs,
    R extends FunctionReturnType<AnyFunctionReference>,
  > = ConvexFunction<"mutation", P, R>;
  type InferArgs<
    T extends AnyFunctionReference,
    P extends DefaultFunctionArgs,
    R extends FunctionReturnType<AnyFunctionReference>,
  > =
    T extends QueryFunction<P, R>
      ? OptionalRestArgs<T>
      : T extends MutationFunction<P, R>
        ? FunctionArgs<T>
        : never;

  const useMut = <
    R,
    P extends DefaultFunctionArgs,
    T extends MutationFunction<P, R>,
  >(
    mutation: T,
  ) => {
    const mutate = useMutation(mutation);
    return async (args: InferArgs<T, P, R>) =>
      (await mutate(...(args as OptionalRestArgs<T>))) as Promise<R>;
  };

  const useQry = <
    R,
    P extends DefaultFunctionArgs,
    T extends QueryFunction<P, R>,
  >(
    query: T,
    args: InferArgs<T, P, R>,
  ) => useQuery(query, ...((args ?? "skip") as OptionalRestArgs<T>)) as R;

  return {
    q,
    qs,
    asyncFn,
    useMut,
    useQry,
  };
};
