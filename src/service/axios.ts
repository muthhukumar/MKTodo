import baseAxios, {AxiosError} from "axios"
import toast from "react-hot-toast"
import {unreachable} from "~/utils/invariants"
import {APIStore} from "~/utils/tauri-store"

const axios = baseAxios.create({
  timeout: 30 * 1000, // 30 seconds
})

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

export default axios
