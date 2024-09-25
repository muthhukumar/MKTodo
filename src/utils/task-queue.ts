import toast from "react-hot-toast"
import {ErrorType} from "./error"

type Task<T> = () => Promise<T>

class APITask<T> {
  private _task: Task<T>
  retries = 0

  constructor(task: Task<T>) {
    this._task = task
  }

  async execute(): Promise<T> {
    if (this.retries === 1) {
      await new Promise(res => setTimeout(res, 500))
    } else if (this.retries === 2) {
      await new Promise(res => setTimeout(res, 1000))
    } else if (this.retries >= 3) {
      await new Promise(res => setTimeout(res, 2000))
    }

    return this._task()
  }
}

function retry(e: unknown): boolean {
  const error = e as ErrorType

  if (error.error.code === "validation_failed") {
    return false
  }

  if (error.status === 422) {
    return false
  }

  return true
}

class AsyncAPITaskQueue {
  private queue: Array<{
    task: APITask<any>
    resolve: (value: any) => void
    reject: (reason?: any) => void
  }> = []
  private activeRequests: number = 0
  private readonly maxConcurrentRequests: number
  private subscribeCallback: ((activeRequests: number) => void) | null = null

  constructor(maxConcurrentRequests: number) {
    this.maxConcurrentRequests = maxConcurrentRequests
  }

  private async processQueue() {
    if (this.queue.length === 0 || this.activeRequests >= this.maxConcurrentRequests) {
      return
    }

    const {task, resolve, reject} = this.queue.shift()!
    this.setActiveRequest(this.activeRequests + 1)

    try {
      resolve(await task.execute())
    } catch (error) {
      if (!retry(error)) {
        return reject(error)
      }

      if (task.retries >= 3) {
        toast.error("Task failed after 3 tries")
        reject(error)
      } else {
        task.retries++
        toast.error("Request failed. Retrying...")

        this.queue.push({task, resolve, reject})
      }
    } finally {
      this.setActiveRequest(this.activeRequests - 1)
      this.processQueue()
    }
  }

  enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({task: new APITask(task), resolve, reject})
      this.processQueue()
    })
  }

  private notifySubscriber() {
    if (this.subscribeCallback) this.subscribeCallback(this.activeRequests)
  }

  setActiveRequest(value: number) {
    this.activeRequests = value

    this.notifySubscriber()
  }

  subscribe(subscribe: AsyncAPITaskQueue["subscribeCallback"]) {
    this.subscribeCallback = subscribe
  }
}

export const taskQueue = new AsyncAPITaskQueue(3)

taskQueue.subscribe(count => {
  const el = document.getElementById("syncing")

  if (!el) return

  if (count === 0) {
    el.style.display = "none"
  } else {
    el.style.display = "block"
  }
})
