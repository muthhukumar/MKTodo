import {logger} from "./logger"

export function invariant(condition: boolean, format: string, ...args: any[]): asserts condition {
  if (format === undefined) {
    throw new Error("assert requires error message format argument")
  }

  let argIndex = 0
  const message = format.replace(/%s/g, () => String(args[argIndex++]))

  if (!condition) {
    if (process.env.NODE_ENV === "production") {
      logger.error(`AssertionError: ${message}`)

      return
    } else {
      const error = new Error(message)
      error.name = "AssertionError"

      if (Error.captureStackTrace) {
        Error.captureStackTrace(error, invariant) // This will omit invariant from the stack trace
      }

      throw error
    }
  }
}

export function unreachable(format: string, ...args: any[]) {
  if (format === undefined) {
    throw new Error("unreachable requires error message format argument")
  }

  let argIndex = 0
  const message = format.replace(/%s/g, () => String(args[argIndex++]))

  if (process.env.NODE_ENV === "production") {
    logger.error(`Unreachable: ${message}`)

    return
  }

  const error = new Error("This code path should be unreachable. " + message)
  error.name = "UnreachableBlockError"

  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, unreachable) // This will omit unreachable from the stack trace
  }

  throw error
}
