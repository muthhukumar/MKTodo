import {TTask} from "~/@types"
import axios from "./axios"
import defaultAxios, {CancelTokenSource} from "axios"
import {ImportantTask, MyDayTask, NewTask, PlannedTask} from "~/utils/tasks"
import {OptionsStore, TasksOfflineStore} from "~/utils/tauri-store"
import {ErrorType} from "~/utils/error"

async function getTasks(
  filter: "my-day" | "important" | null,
  query?: string,
  random?: boolean,
  cancelTokenSource?: CancelTokenSource,
) {
  try {
    const options = (await OptionsStore.get()) ?? {}

    const response = await axios.get(`/api/v1/tasks`, {
      params: {filter, random, query, ...options},
      ...(cancelTokenSource
        ? {
            cancelToken: cancelTokenSource.token,
          }
        : {}),
    })

    const tasks = response.data.data as Array<TTask>

    await TasksOfflineStore.set(tasks)
    TasksOfflineStore.save()

    return tasks
  } catch (error) {
    return Promise.reject(error)
  }
}

async function getTask(taskId: TTask["id"]) {
  try {
    const response = await axios.get(`/api/v1/task/${taskId}`)

    return response.data.data as TTask
  } catch (error) {
    return Promise.reject(error)
  }
}

async function createTask(task: NewTask | ImportantTask | MyDayTask | PlannedTask) {
  try {
    const response = await axios.post(`/api/v1/task/create`, task)

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function deleteTaskById(id: number) {
  try {
    const response = await axios.delete(`/api/v1/task/${id}`)

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function updateTaskById({id, task}: {id: number; task: string}) {
  try {
    const response = await axios.post(`/api/v1/task/${id}`, {
      name: task,
    })

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function toggleTaskCompletedById(id: number) {
  try {
    const response = await axios.post(`/api/v1/task/${id}/completed/toggle`)

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function toggleTaskImportanceById(id: number) {
  try {
    const response = await axios.post(`/api/v1/task/${id}/important/toggle`)

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function toggleTaskAddToMyDayById(id: number) {
  try {
    const response = await axios.post(`/api/v1/task/${id}/add-to-my-day/toggle`)

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function updateTaskDueDateById(id: number, dueDate: string) {
  try {
    const response = await axios.post(`/api/v1/task/${id}/add/due-date`, {
      due_date: dueDate,
    })

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function checkServerHealth({
  notifyInternetStatus,
  notifySessionValidity,
  notifyServerStatus,
}: {
  notifyServerStatus: (isOnline: boolean) => void
  notifyInternetStatus?: (isOnline: boolean) => void
  notifySessionValidity?: {
    creds: {
      host: string
      apiKey: string
    }
    notify: (isOnline: boolean) => void
  }
}) {
  if (notifyInternetStatus) {
    defaultAxios
      .head("https://www.muthukumar.dev", {
        timeout: 1000 * 15,
        validateStatus: status => status >= 200 && status <= 300,
      })
      .then(() => notifyInternetStatus(true))
      .catch(() => notifyInternetStatus(false))
  }

  if (notifySessionValidity) {
    defaultAxios
      .get(`${notifySessionValidity.creds.host}/api/v1/tasks`, {
        headers: {
          "x-api-key": notifySessionValidity.creds.apiKey,
        },
        timeout: 1000 * 15,
      })
      .then(() => notifySessionValidity.notify(true))
      .catch((error: ErrorType) => {
        if (error.status === 401 || error.status === 403) notifySessionValidity.notify(false)
      })
  }

  axios
    .get("/health", {timeout: 1000 * 15})
    .then(() => notifyServerStatus(true))
    .catch(() => notifyServerStatus(false))
}

async function fetchWebPageTitle(link: string) {
  try {
    const response = await axios.get("/api/v1/fetch-title", {
      params: {
        url: link,
      },
    })

    return response.data.data as string
  } catch (error) {
    return Promise.reject(error)
  }
}

async function updateTaskMetadata({id, metadata}: {id: number; metadata: string}) {
  try {
    const response = await axios.post(`/api/v1/task/${id}/metadata`, {
      metadata,
    })

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

export const API = {
  getTasks,
  createTask,
  deleteTaskById,
  updateTaskById,
  toggleTaskCompletedById,
  toggleTaskImportanceById,
  toggleTaskAddToMyDayById,
  updateTaskDueDateById,
  getTask,
  checkServerHealth,
  fetchWebPageTitle,
  updateTaskMetadata,
}
