import {AxiosError} from "axios"
import toast from "react-hot-toast"

export function handleError(err: unknown, defaultErrorMessage: string): void {
  const error = err as AxiosError

  const status = error?.response?.status

  if (status === 500) {
    const errorMessage = typeof error.response?.data === "string" ? error.response.data : null
    // @ts-ignore
    const msg = "message" in error.response?.data?.message! ? error.response?.data?.message : null

    const result = errorMessage || msg || defaultErrorMessage

    toast.error(`Server error: ${result}`)
  } else {
    toast.error(defaultErrorMessage)
  }
}

type ErrorType =
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
  | {message: string}

export function handleError2({error: e, defaultMessage}: {error: unknown; defaultMessage: string}) {
  const error = e as ErrorType

  if ("message" in error && !("code" in error)) {
    toast.error(error.message)
    return
  }

  if ("code" in error && error.code === "validation_failed") {
    toast.error(error.invalid_fields.map(f => f.error_message).join(", "))
    return
  }

  toast.error(defaultMessage)
}
