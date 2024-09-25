import toast from "react-hot-toast"
import {invariant} from "./invariants"

export type ErrorType = {
  error:
    | {
        "status": number
        "object": "error"
        "code": "validation_failed"
        "message": string
        "request_id": string
        "invalid_fields": Array<{
          "error_message": string
          "field": string
          "is_invalid": boolean
        }>
      }
    | {message: string; status: number; code: "error_message"}
  status: number
}

export function getErrorMessage({
  error: e,
  defaultMessage,
}: {
  error: unknown
  defaultMessage: string
}) {
  invariant(Boolean(defaultMessage), "Default message should not be empty")

  const {error} = e as ErrorType

  let message = ""

  if (!error) {
    message = defaultMessage
  }

  if (error && error.code) {
    switch (error.code) {
      case "validation_failed": {
        message = error.invalid_fields.map(f => f.error_message).join(", ")
        break
      }
      case "error_message": {
        message = error.message
        break
      }
    }
  }

  if (error && error.status >= 500) {
    message = `Internal server error: ${message}`
  }

  return message
}

export function handleError({error: e, defaultMessage}: {error: unknown; defaultMessage: string}) {
  toast.error(getErrorMessage({error: e, defaultMessage}))
}
