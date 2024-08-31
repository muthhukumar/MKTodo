import baseAxios from "axios"
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
  response => {
    return response
  },
  error => {
    return Promise.reject(error.response.data)
  },
)

export default axios
