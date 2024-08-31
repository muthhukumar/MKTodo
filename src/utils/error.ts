import toast from "react-hot-toast"

export type ErrorType =
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

export function handleError({error: e, defaultMessage}: {error: unknown; defaultMessage: string}) {
  const error = e as ErrorType

  let message = ""

  if (error.code) {
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

  if (error.status >= 500) {
    message = `Internal server error: ${message}`
  }

  toast.error(message || defaultMessage)
}
