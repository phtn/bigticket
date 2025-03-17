/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as events_create from "../events/create.js";
import type * as events_d from "../events/d.js";
import type * as events_get from "../events/get.js";
import type * as events_update from "../events/update.js";
import type * as files_create from "../files/create.js";
import type * as files_get from "../files/get.js";
import type * as transactions_create from "../transactions/create.js";
import type * as transactions_d from "../transactions/d.js";
import type * as transactions_get from "../transactions/get.js";
import type * as users_add from "../users/add.js";
import type * as users_create from "../users/create.js";
import type * as users_d from "../users/d.js";
import type * as users_get from "../users/get.js";
import type * as users_update from "../users/update.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "events/create": typeof events_create;
  "events/d": typeof events_d;
  "events/get": typeof events_get;
  "events/update": typeof events_update;
  "files/create": typeof files_create;
  "files/get": typeof files_get;
  "transactions/create": typeof transactions_create;
  "transactions/d": typeof transactions_d;
  "transactions/get": typeof transactions_get;
  "users/add": typeof users_add;
  "users/create": typeof users_create;
  "users/d": typeof users_d;
  "users/get": typeof users_get;
  "users/update": typeof users_update;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
