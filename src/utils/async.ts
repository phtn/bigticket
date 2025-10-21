type AsyncFn<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult>

interface AsyncHandlerResponseOptions<TArgs extends unknown[]> {
  /** Number of retry attempts (default: 0) */
  retries?: number
  /** Custom error handler callback */
  onError?: (error: unknown, context: {args: TArgs}) => void
  /** Whether to rethrow errors in development (default: false) */
  rethrowInDev?: boolean
  /** Custom logger function (supports both sync and async) */
  logger?: (
    message: string,
    meta?: Record<string, unknown>,
  ) => void | Promise<void>
  /** Explicit function name override for logging */
  functionName?: string
  /** Backoff delay in milliseconds for retries (default: 0) */
  backoffMs?: number
}

type AsyncResult<T> =
  | {data: T; error: undefined}
  | {data: undefined; error: unknown}

/**
 * Enhanced function name extraction that handles arrow functions and assignments
 */
function getFunctionName(fn: unknown): string | undefined {
  // Prefer the runtime name if available (named functions / function expressions)
  if (typeof fn === 'function') {
    const name = (fn as {name?: string}).name
    if (typeof name === 'string' && name.length > 0) return name
  }

  // Fallback to string representation (covers arrow functions and assignments)
  const fnString = typeof fn === 'function' ? fn.toString() : String(fn)

  // Match: const funcName = (...) => or let funcName = (...) =>
  const assignmentMatch = /(?:const|let|var)\s+(\w+)\s*=/.exec(fnString)
  if (assignmentMatch) return assignmentMatch[1]

  // Match: funcName: (...) => (object method shorthand)
  const methodMatch = /(\w+):\s*(?:async\s+)?\(/.exec(fnString)
  if (methodMatch) return methodMatch[1]

  return 'anonymous'
}

/**
 * Sleep utility for backoff delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Format errors into a consistent structure
 */
function formatError(error: unknown): Record<string, unknown> {
  if (typeof error === 'string') return {message: error}
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }
  return {message: 'Unknown error', raw: error}
}

/**
 * An async function wrapper with built-in error handling, retry logic, and structured responses.
 *
 * This utility ensures your async function returns a predictable `{ data, error }`.
 * Useful in API handlers, React Query, and service layers.
 *
 * @template TArgs - The argument tuple type of the original async function.
 * @template TResult - The resolved return type of the original async function.
 *
 * @param fn - The async function to wrap. Must return a `Promise<TResult>`.
 * @param options - Optional configuration:
 * - `retries` (default: 0): number of times to retry the function if it throws
 * - `onError`: custom callback for handling/logging errors
 * - `rethrowInDev` (default: false): rethrows the error in non-production environments
 * - `logger`: a custom logger function (supports async) to replace `console.error`
 * - `functionName`: explicit function name override for logging
 * - `backoffMs`: delay between retries in milliseconds (uses exponential backoff)
 *
 * @returns A new async function that returns `{ data: TResult; error: undefined }` or `{ data: undefined; error: unknown }`.
 *
 * @example
 * ```ts
 * async function fetchUser(id: number): Promise<User> {
 *   const res = await fetch(`/api/user/${id}`);
 *   if (!res.ok) throw new Error("Failed to fetch user");
 *   return res.json();
 * }
 *
 * const asyncHandler = handleAsync(fetchUser, {
 *   retries: 2,
 *   backoffMs: 100,
 *   functionName: 'fetchUser'
 * });
 *
 * const { data, error } = await asyncHandler(1);
 * if (data) {
 *   // TypeScript knows data is User and error is undefined
 *   console.log(data.name);
 * }
 * ```
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/functions.html#function-types Function Types - TS Docs}
 */
export function handleAsync<TArgs extends unknown[], TResult>(
  fn: AsyncFn<TArgs, TResult>,
  options: AsyncHandlerResponseOptions<TArgs> = {},
): (...args: TArgs) => Promise<AsyncResult<TResult>> {
  const {
    retries = 0,
    onError,
    rethrowInDev = false,
    logger = (msg, meta) => console.error(msg, meta),
    functionName,
    backoffMs = 0,
  } = options

  const resolvedFunctionName = functionName ?? getFunctionName(fn)

  /**
   * Fire-and-forget async logger that doesn't block execution
   */
  const logAsync = (message: string, meta?: Record<string, unknown>): void => {
    try {
      const result = logger(message, meta)
      // Normalize the logger result to a Promise so both sync and async
      // loggers are handled uniformly. This avoids relying on `instanceof Promise`.
      Promise.resolve(result).catch((logError) =>
        console.error('Async logger failed:', formatError(logError)),
      )
    } catch (logError) {
      console.error('Logger failed:', formatError(logError))
    }
  }

  return async (...args: TArgs): Promise<AsyncResult<TResult>> => {
    let attempt = 0

    while (attempt <= retries) {
      try {
        const data = await fn(...args)
        return {data, error: undefined}
      } catch (error: unknown) {
        attempt++
        const context = {args}

        // Log the error
        logAsync(
          `Error in ${resolvedFunctionName} [Attempt ${attempt}/${retries + 1}]`,
          {
            error: formatError(error),
            args,
            attempt,
            maxAttempts: retries + 1,
          },
        )

        // Execute custom error handler
        if (onError) {
          try {
            onError(error, context)
          } catch (handlerError) {
            logAsync('Error in custom onError handler', {
              error: formatError(handlerError),
              originalError: formatError(error),
            })
          }
        }

        const isLastAttempt = attempt > retries

        if (isLastAttempt) {
          // Check if we should rethrow in development
          const isDevelopment =
            typeof process !== 'undefined'
              ? process.env?.NODE_ENV !== 'production'
              : false

          if (rethrowInDev && isDevelopment) {
            throw error
          }

          return {data: undefined, error: formatError(error)}
        }

        // Apply backoff delay before next retry
        if (backoffMs > 0) {
          const delay = backoffMs * Math.pow(2, attempt - 1)
          await sleep(delay)
        }
      }
    }

    // This should never be reached, but TypeScript requires it
    return {data: undefined, error: formatError('Unexpected execution path')}
  }
}
