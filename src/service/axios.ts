import baseAxios, {
  AxiosError,
  AxiosInstance,
  CancelTokenSource,
  CancelTokenStatic,
  isCancel,
} from "axios"
import toast from "react-hot-toast"
import {unreachable} from "~/utils/invariants"
import {APIStore} from "~/utils/tauri-store"

interface CustomAxiosInstance extends AxiosInstance {
  CancelToken: CancelTokenStatic
  isCancel: (value: any) => boolean
}

const axios: CustomAxiosInstance = baseAxios.create({
  timeout: 30 * 1000, // 30 seconds
}) as CustomAxiosInstance

axios.CancelToken = baseAxios.CancelToken
axios.isCancel = baseAxios.isCancel

axios.interceptors.request.use(async config => {
  try {
    const creds = await APIStore.get()

    config.baseURL = creds?.host

    config.headers.set("x-api-key", creds?.apiKey)
  } catch {}

  return config
})

axios.interceptors.response.use(
  response => response,
  error => {
    if (isCancel(error)) {
      return Promise.reject({
        error: {message: "Request is cancelled", code: "request_cancelled"},
        status: 400,
      })
    }

    if (isNetworkError(error)) {
      return Promise.reject({
        error: {message: "Request rate limited", code: "request_rate_limited"},
        status: 400,
      })
    }

    if (error.response.status === 404) {
      toast.error(
        `Error 404: The API you're trying to reach does not exist. ${
          error?.response?.request?.responseURL
        }`,
      )

      unreachable(
        "We should not hit a API endpoint that does not exist. But hitting %s",
        error?.response?.request?.responseURL,
      )
    }

    if (isNetworkError(error)) {
      toast.error(error.message)
    }

    return Promise.reject({
      error: error.response.data,
      status: error.response.status,
    })
  },
)

function isNetworkError(err: AxiosError) {
  return !!err.isAxiosError && !err.response
}

export function getCancelTokenSource(): CancelTokenSource {
  return axios.CancelToken.source()
}

export default axios
