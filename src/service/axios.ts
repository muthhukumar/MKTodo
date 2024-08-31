import baseAxios, {AxiosError} from "axios"
import toast from "react-hot-toast"
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
    if (isNetworkError(error)) {
      toast.error(error.message)
    }

    return Promise.reject(error.response.data)
  },
)

function isNetworkError(err: AxiosError) {
  return !!err.isAxiosError && !err.response
}

export default axios
