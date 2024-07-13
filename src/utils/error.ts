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
