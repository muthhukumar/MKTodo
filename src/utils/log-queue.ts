import {ErrorType} from "./error"
import {CancelTokenSource} from "axios"
import {v4 as uuidv4} from "uuid"

type Task<T> = () => Promise<T>

class APITask<T> {
  private _task: Task<T>
  retries = 0

  constructor(
    task: Task<T>,
    public id?: string,
    public cancelTokenSource?: CancelTokenSource,
  ) {
    this._task = task
  }

  async execute(): Promise<T> {
    if (this.retries === 1) {
      await new Promise(res => setTimeout(res, 1000))
    } else if (this.retries === 2) {
      await new Promise(res => setTimeout(res, 2000))
    } else if (this.retries >= 3) {
      await new Promise(res => setTimeout(res, 5000))
    }

    return this._task()
  }
}

// For known error do not retry. For unknown error retry.
function retry(e: unknown): boolean {
  const error = e as ErrorType

  try {
    if (error.status === 422) {
      return false
    }

    if (error.error.code === "request_rate_limited") {
      return false
    }

    if (error.error.code === "validation_failed") {
      return false
    }

    if (error.error.code === "request_cancelled") {
      return false
    }
  } catch (error) {}

  return true
}

class AsyncAPITaskQueue {
  private queue: Array<{
    task: APITask<any>
    resolve: (value: any) => void
    reject: (reason?: any) => void
  }> = []
  private activeRequestsCount: number = 0
  private readonly maxConcurrentRequests: number
  private subscribeCallback: ((value: this) => void) | null = null
  private activeRequests: Array<{id: string; task: APITask<any>}> = []

  constructor(maxConcurrentRequests: number) {
    this.maxConcurrentRequests = maxConcurrentRequests
  }

  getTasksCount() {
    return this.queue.length
  }

  private async processQueue() {
    if (this.queue.length === 0 || this.activeRequestsCount >= this.maxConcurrentRequests) {
      return
    }

    const {task, resolve, reject} = this.queue.shift()!
    this.setActiveRequest(this.activeRequestsCount + 1)

    const id = uuidv4()

    this.activeRequests.push({task, id})

    try {
      resolve(await task.execute())
    } catch (error) {
      if (!retry(error)) {
        return reject(error)
      }

      if (task.retries >= 3) {
        reject(error)
      } else {
        task.retries++

        this.queue.push({task, resolve, reject})
      }
    } finally {
      this.activeRequests = this.activeRequests.filter(aq => aq.id !== id)
      this.setActiveRequest(this.activeRequestsCount - 1)
      this.processQueue()
    }
  }

  enqueueUnique<T>(props: {
    task: Task<T>
    id: string
    cancelTokenSource: CancelTokenSource
  }): Promise<T> {
    const {task, id, cancelTokenSource: abortController} = props

    return new Promise<T>((resolve, reject) => {
      this.queue = this.queue.filter(t => {
        if (t.task.id === id) {
          t.task.cancelTokenSource?.cancel()

          return true
        }

        return false
      })

      this.activeRequests.forEach(aq => {
        if (aq.task.id === id) {
          aq.task.cancelTokenSource?.cancel()
        }
      })

      this.queue.push({task: new APITask(task, id, abortController), resolve, reject})

      this.processQueue()
    })
  }

  enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({task: new APITask(task), resolve, reject})

      this.processQueue()
    })
  }

  private notifySubscriber() {
    if (this.subscribeCallback) this.subscribeCallback(this)
  }

  setActiveRequest(value: number) {
    this.activeRequestsCount = value
    this.notifySubscriber()
  }

  subscribe(subscribe: AsyncAPITaskQueue["subscribeCallback"]) {
    this.subscribeCallback = subscribe
  }
}

export const logQueue = new AsyncAPITaskQueue(3)
