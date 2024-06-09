import baseAxios from "axios"
import {APIStore} from "~/utils/tauri-store"

const axios = baseAxios.create()

axios.interceptors.request.use(async config => {
  try {
    const creds = await APIStore.get()

    config.baseURL = creds?.host

    config.headers.set("x-api-key", creds?.apiKey)
  } catch {
    config.baseURL = "http://192.168.1.4:300"
  }

  return config
})

export default axios
