import baseAxios from "axios"
import {APIStore} from "~/utils/tauri-store"

const axios = baseAxios.create()

axios.interceptors.request.use(async config => {
  try {
    const creds = await APIStore.get()

    config.baseURL = creds?.host

    config.headers.set("x-api-key", creds?.apiKey)
  } catch {}

  return config
})

export default axios
