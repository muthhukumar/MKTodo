import {TTask} from "../@types"
import config from "../config"
import axios from "./axios"

const serverURL = config.url.SERVER_URL

async function getTasks() {
  try {
    const response = await axios.get(`${serverURL}/api/v1/tasks`)

    return response.data.data as Array<TTask>
  } catch (error) {
    return []
  }
}

async function createTask({task}: {task: string}) {
  try {
    const response = await axios.post(`${serverURL}/api/v1/task/create`, {
      name: task,
    })

    return response.data as {message: string}
  } catch (error) {
    return null
  }
}

async function deleteTaskById(id: number) {
  try {
    const response = await axios.delete(`${serverURL}/api/v1/task/${id}`)

    return response.data as {message: string}
  } catch (error) {
    return null
  }
}

async function updateTaskById({id, task}: {id: number; task: string}) {
  try {
    const response = await axios.post(`${serverURL}/api/v1/task/${id}`, {
      name: task,
    })

    return response.data as {message: string}
  } catch (error) {
    return null
  }
}

async function toggleTaskById(id: number) {
  try {
    const response = await axios.post(`${serverURL}/api/v1/task/${id}/toggle`)

    return response.data as {message: string}
  } catch (error) {
    return null
  }
}

export const API = {
  getTasks,
  createTask,
  deleteTaskById,
  updateTaskById,
  toggleTaskById,
}
