type Task<T> = () => Promise<T>

class TaskQueue {
  private queue: Array<{
    task: Task<any>
    resolve: (value: any) => void
    reject: (reason?: any) => void
  }> = []
  private activeRequests: number = 0
  private readonly maxConcurrentRequests: number

  constructor(maxConcurrentRequests: number) {
    this.maxConcurrentRequests = maxConcurrentRequests
  }

  private processQueue() {
    if (this.queue.length === 0 || this.activeRequests >= this.maxConcurrentRequests) {
      return
    }

    const {task, resolve, reject} = this.queue.shift()!
    this.activeRequests++

    task()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.activeRequests--
        this.processQueue()
      })
  }

  enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({task, resolve, reject})
      this.processQueue()
    })
  }
}

export const taskQueue = new TaskQueue(5)
