export function invariants(condition: boolean, format: string, ...args: any[]): void {
  if (format === undefined) {
    throw new Error("assert requires error message format argument")
  }

  let argIndex = 0
  const message = format.replace(/%s/g, () => String(args[argIndex++]))

  if (process.env.NODE_ENV === "production") {
    console.warn(`Assertion failed: ${message}`)
    return
  }

  if (!condition) {
    const error = new Error(message)
    error.name = "AssertionError"

    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, invariants) // This will omit assert from the stack trace
    }

    throw error
  }
}

export function unreachable(format: string, ...args: any[]) {
  if (format === undefined) {
    throw new Error("unreachable requires error message format argument")
  }

  let argIndex = 0
  const message = format.replace(/%s/g, () => String(args[argIndex++]))

  if (process.env.NODE_ENV === "production") {
    console.warn(`Unreachable: ${message}`)
    return
  }

  const error = new Error("This code path should be unreachable." + message)
  error.name = "UnreachableBlockError"

  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, unreachable) // This will omit unreachable from the stack trace
  }

  throw error
}
