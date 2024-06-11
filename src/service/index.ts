import {TTask} from "~/@types"
import axios from "./axios"

async function getTasks(filter: "my-day" | "important" | null) {
  try {
    const response = await axios.get(`/api/v1/tasks`, {params: {filter}})

    return response.data.data as Array<TTask>
  } catch (error) {
    return Promise.reject("Failed")
  }
}

async function createTask({task}: {task: string}) {
  try {
    const response = await axios.post(`/api/v1/task/create`, {
      name: task,
    })

    return response.data as {message: string}
  } catch (error) {
    return Promise.reject("Failed")
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

export const API = {
  getTasks,
  createTask,
  deleteTaskById,
  updateTaskById,
  toggleTaskCompletedById,
  toggleTaskImportanceById,
  toggleTaskAddToMyDayById,
  updateTaskDueDateById,
}
