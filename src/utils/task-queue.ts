type Task<T> = () => Promise<T>

class TaskQueue {
  private queue: Array<{
    task: Task<any>
    resolve: (value: any) => void
    reject: (reason?: any) => void
  }> = []
  private activeRequests: number = 0
  private readonly maxConcurrentRequests: number
  private subscribeCallback: ((activeRequests: number) => void) | null = null

  constructor(maxConcurrentRequests: number) {
    this.maxConcurrentRequests = maxConcurrentRequests
  }

  private processQueue() {
    if (this.queue.length === 0 || this.activeRequests >= this.maxConcurrentRequests) {
      return
    }

    const {task, resolve, reject} = this.queue.shift()!
    this.setActiveRequest(this.activeRequests + 1)

    task()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.setActiveRequest(this.activeRequests - 1)
        this.processQueue()
      })
  }

  enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({task, resolve, reject})
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

  subscribe(subscribe: TaskQueue["subscribeCallback"]) {
    this.subscribeCallback = subscribe
  }
}

export const taskQueue = new TaskQueue(3)

taskQueue.subscribe(count => {
  const el = document.getElementById("activeRequestCount")

  if (!el) return

  el.textContent = String(count)
})
