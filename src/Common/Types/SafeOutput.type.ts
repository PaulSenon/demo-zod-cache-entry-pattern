/**
 * A simple pattern to force explicit contracts with error handling. Will hint you any bad error handling at buildtime (where throwed Error won't).
 */
export type SafeOutput<T> = { status: "error"; value: undefined; error: Error } | { status: "success"; value: T };

/**
 * Simply a helper tool to build a SafeOutput "success"
 */
export function createSuccessOutput<T>(value: T): SafeOutput<T> {
  return {
    status: "success",
    value,
  };
}

/**
 * Simply a helper tool to build a SafeOutput "error"
 */
export function createErrorOutput<T extends Error>(error: T): SafeOutput<undefined> {
  return {
    status: "error",
    value: undefined,
    error,
  };
}
