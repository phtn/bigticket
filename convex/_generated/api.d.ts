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
import type * as articles_d from "../articles/d.js";
import type * as articles_get from "../articles/get.js";
import type * as events_create from "../events/create.js";
import type * as events_d from "../events/d.js";
import type * as events_get from "../events/get.js";
import type * as events_update from "../events/update.js";
import type * as files_create from "../files/create.js";
import type * as files_get from "../files/get.js";
import type * as tickets_create from "../tickets/create.js";
import type * as tickets_d from "../tickets/d.js";
import type * as tickets_get from "../tickets/get.js";
import type * as users_add from "../users/add.js";
import type * as users_create from "../users/create.js";
import type * as users_d from "../users/d.js";
import type * as users_get from "../users/get.js";
import type * as users_update from "../users/update.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "articles/d": typeof articles_d;
  "articles/get": typeof articles_get;
  "events/create": typeof events_create;
  "events/d": typeof events_d;
  "events/get": typeof events_get;
  "events/update": typeof events_update;
  "files/create": typeof files_create;
  "files/get": typeof files_get;
  "tickets/create": typeof tickets_create;
  "tickets/d": typeof tickets_d;
  "tickets/get": typeof tickets_get;
  "users/add": typeof users_add;
  "users/create": typeof users_create;
  "users/d": typeof users_d;
  "users/get": typeof users_get;
  "users/update": typeof users_update;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
