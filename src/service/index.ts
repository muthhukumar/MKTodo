import {TTask} from "~/@types"
import axios from "./axios"
import defaultAxios from "axios"
import {ImportantTask, MyDayTask, NewTask, PlannedTask} from "~/utils/tasks"
import {Creds} from "~/auth-context"
import {OptionsStore} from "~/utils/tauri-store"

async function getTasks(filter: "my-day" | "important" | null, query?: string, random?: boolean) {
  try {
    const options = (await OptionsStore.get()) ?? {}

    const response = await axios.get(`/api/v1/tasks`, {
      params: {filter, random, query, ...options},
    })

    return response.data.data as Array<TTask>
  } catch (error) {
    return Promise.reject("Failed")
  }
}

async function getTask(taskId: TTask["id"]) {
  try {
    const response = await axios.get(`/api/v1/task/${taskId}`)

    return response.data.data as TTask
  } catch (error) {
    return Promise.reject("Failed")
  }
}

async function createTask(task: NewTask | ImportantTask | MyDayTask | PlannedTask) {
  try {
    const response = await axios.post(`/api/v1/task/create`, task)

    return response.data as {message: string}
  } catch (error) {
    const e = error as {response: {data: unknown}}

    // TODO: refactor this later
    return Promise.reject(e.response.data)
  }
}

async function deleteTaskById(id: number) {
  try {
    const response = await axios.delete(`/api/v1/task/${id}`)

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject("Failed")
  }
}

async function updateTaskById({id, task}: {id: number; task: string}) {
  try {
    const response = await axios.post(`/api/v1/task/${id}`, {
      name: task,
    })

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject("Failed")
  }
}

async function toggleTaskCompletedById(id: number) {
  try {
    const response = await axios.post(`/api/v1/task/${id}/completed/toggle`)

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject("Failed")
  }
}

async function toggleTaskImportanceById(id: number) {
  try {
    const response = await axios.post(`/api/v1/task/${id}/important/toggle`)

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject("Failed")
  }
}

async function toggleTaskAddToMyDayById(id: number) {
  try {
    const response = await axios.post(`/api/v1/task/${id}/add-to-my-day/toggle`)

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject("Failed")
  }
}

async function updateTaskDueDateById(id: number, dueDate: string) {
  try {
    const response = await axios.post(`/api/v1/task/${id}/add/due-date`, {
      due_date: dueDate,
    })

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject("Failed")
  }
}

async function pingWithAuth({host, apiKey}: Creds): Promise<boolean> {
  try {
    await axios.get(`${host}/api/v1/tasks`, {
      headers: {
        "x-api-key": apiKey,
      },
      timeout: 1000 * 30, // 30 seconds
    })

    return true
  } catch {
    return false
  }
}

async function ping(): Promise<{server: boolean; internet: boolean}> {
  let server = false
  let internet = false

  try {
    await axios.get("/health", {
      timeout: 1000 * 15, // 15 seconds
    })
    server = true
  } catch {
    server = false
  }

  try {
    // TODO - maybe remove this. This is actually slowing down our app.
    await defaultAxios.get("https://www.muthukumar.dev", {
      timeout: 1000 * 15, // 15 seconds
    })
    internet = true
  } catch {
    internet = false
  }

  return {server, internet}
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
  ping,
  pingWithAuth,
}
