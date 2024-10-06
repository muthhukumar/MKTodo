import baseAxios, {
  AxiosError,
  AxiosInstance,
  CancelTokenSource,
  CancelTokenStatic,
  isCancel,
} from "axios"
import {logger} from "~/utils/logger"
import {getCreds} from "~/utils/tauri-store"

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
    const creds = await getCreds()

    config.baseURL = creds?.host

    config.headers.set("x-api-key", creds?.apiKey)
  } catch (error) {
    logger.error("Axios request interceptor throw error", error)
  }

  return config
})

axios.interceptors.response.use(
  response => response,
  error => {
    if (isCancel(error)) {
      logger.info("Request cancelled", JSON.stringify(error))

      return Promise.reject({
        error: {message: "Request is cancelled", code: "request_cancelled"},
        status: 400,
      })
    }

    if (isNetworkError(error)) {
      logger.info("Network error or axios error or rate limited", JSON.stringify(error))

      return Promise.reject({
        error: {message: "Request rate limited", code: "request_rate_limited"},
        status: 400,
      })
    }

    if (error.response.status === 404) {
      logger.error("404: The API you're trying to reach does not exist", JSON.stringify(error))

      return Promise.reject({
        error: {message: "API not found.", code: "404"},
        status: 404,
      })
    }

    if (error.response.status === 500) {
      logger.error("500: Internal server error", JSON.stringify(error))

      return Promise.reject({
        error: {message: `Internal server error. ${error.response.data.message}.`},
        status: 500,
      })
    }

    logger.info("Unknown error", JSON.stringify(error))

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
