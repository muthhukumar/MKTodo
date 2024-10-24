import {List, Log, TTask} from "~/@types"
import axios from "./axios"
import defaultAxios, {CancelTokenSource} from "axios"
import {ImportantTask, MyDayTask, NewTask, PlannedTask} from "~/utils/tasks"
import {getCreds} from "~/utils/tauri-store"
import {ErrorType} from "~/utils/error"
import {TasksStore} from "~/utils/persistent-storage"

async function getTasks({
  filter,
  query,
  cancelTokenSource,
  listId,
  showAllTasks,
  showCompleted,
}: {
  filter: "my-day" | "important" | null
  query?: string
  cancelTokenSource?: CancelTokenSource
  listId?: number | string
  showAllTasks: boolean
  showCompleted?: boolean
}) {
  try {
    const showCompletedTasks = window.featureManager.isEnabled("ShowCompletedTasks")

    const response = await axios.get(`/api/v1/tasks`, {
      params: {
        filter,
        query,
        showCompleted: showCompleted ?? showCompletedTasks,
        list_id: listId,
        show_all_tasks: showAllTasks,
      },
      ...(cancelTokenSource
        ? {
            cancelToken: cancelTokenSource.token,
          }
        : {}),
    })

    const tasks = response.data.data as Array<TTask>

    TasksStore.set(tasks)
    TasksStore.save()

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

    return response.data as {message: string; id: number}
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

async function getLogs() {
  try {
    const response = await axios.get(`/api/v1/log`)

    return response.data.data as Array<Log>
  } catch (error) {
    return Promise.reject(error)
  }
}

function log(logs: Array<{level: string; log: string; created_at: string}>) {
  try {
    getCreds().then(creds => {
      defaultAxios.post(
        `${creds?.host}/api/v1/log`,
        {data: logs},
        {
          headers: {
            "x-api-key": creds?.apiKey,
          },
        },
      )
    })
  } catch (error) {}
}

async function getTasksNames(cancelTokenSource?: CancelTokenSource) {
  try {
    const response = await axios.get(`/api/v1/tasks`, {
      params: {showCompleted: true, show_all_tasks: true},
      ...(cancelTokenSource
        ? {
            cancelToken: cancelTokenSource.token,
          }
        : {}),
    })

    const tasks = response.data.data as Array<TTask>

    return tasks
      .map(t => [
        t.name,
        ...t.metadata
          .trim()
          .split(",")
          .filter(Boolean)
          .map(mt => `! !${mt}`),
      ])
      .flat()
  } catch (error) {
    return Promise.reject(error)
  }
}

async function createSubTask(payload: {name: string; task_id: number}) {
  try {
    const response = await axios.post(`/api/v1/task/sub-task/create`, payload)

    return response.data as {message: string; id: number}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function updateSubTaskById({id, task}: {id: number; task: string}) {
  try {
    const response = await axios.post(`/api/v1/sub-task/${id}`, {
      name: task,
    })

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function deleteSubTaskById(id: number) {
  try {
    const response = await axios.delete(`/api/v1/sub-task/${id}`)

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function toggleSubTaskCompletedById(id: number) {
  try {
    const response = await axios.post(`/api/v1/sub-task/${id}/completed/toggle`)

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function updateTaskRecurrence(props: {
  recurrenceInterval: string | number
  recurrencePattern: string
  startDate: string
  taskId: number
}) {
  try {
    const response = await axios.post(`/api/v1/task/${props.taskId}/recurrence`, {
      "recurrence_interval": Number(props.recurrenceInterval),
      "recurrence_pattern": props.recurrencePattern,
      "start_date": props.startDate,
    })

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function createList(listName: string) {
  try {
    const response = await axios.post(`/api/v1/list/new`, {
      "name": listName,
    })

    return response.data as {message: string; id: number}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function updateList(listId: number, listName: string) {
  try {
    const response = await axios.post(`/api/v1/list/${listId}`, {
      "name": listName,
    })

    return response.data as {message: string; id: number}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function getLists() {
  try {
    const response = await axios.get(`/api/v1/lists`)

    return response.data.data as Array<List>
  } catch (error) {
    return Promise.reject(error)
  }
}

async function updateTaskListId(taskId: number, listId: number | null | string) {
  try {
    const response = await axios.post(`/api/v1/task/${taskId}/list/update`, {
      list_id: Number(listId),
    })

    return response.data.data as Array<List>
  } catch (error) {
    return Promise.reject(error)
  }
}

async function deleteListById(id: number) {
  try {
    const response = await axios.delete(`/api/v1/list/${id}`)

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject(error)
  }
}

async function getList(listId: number | string) {
  try {
    const response = await axios.get(`/api/v1/list/${listId}`)

    return response.data.data as List
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
  getLogs,
  log,
  getTasksNames,
  createSubTask,
  updateSubTaskById,
  deleteSubTaskById,
  toggleSubTaskCompletedById,
  updateTaskRecurrence,
  createList,
  getLists,
  updateList,
  updateTaskListId,
  deleteListById,
  getList,
}
