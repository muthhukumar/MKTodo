class Batcher<T> {
  items: Array<T> = []
  onFull: (items: Array<T>) => void = () => undefined
  size: number = 20
  batchProcessingTimeoutId: NodeJS.Timeout | null = null
  batchProcessingTimeoutDuration: number = 20

  constructor({
    size,
    onFull,
    batchProcessingTimeoutDuration,
  }: {
    size: number
    onFull: (items: Array<T>) => void
    batchProcessingTimeoutDuration?: number
  }) {
    this.size = size
    this.onFull = onFull
    this.scheduleProcessing()

    if (batchProcessingTimeoutDuration)
      this.batchProcessingTimeoutDuration = batchProcessingTimeoutDuration
  }

  private clearExistingTimeout() {
    if (this.batchProcessingTimeoutId) {
      clearTimeout(this.batchProcessingTimeoutId)
      this.batchProcessingTimeoutId = null
    }
  }

  private scheduleProcessing() {
    this.clearExistingTimeout()

    this.batchProcessingTimeoutId = setTimeout(() => {
      if (this.items.length === 0) return this.clearExistingTimeout()

      this.processItems()

      this.clearExistingTimeout()
    }, this.batchProcessingTimeoutDuration * 1000)
  }

  add(item: T) {
    this.items.push(item)
    this.scheduleProcessing()
    this.processIfFul()
  }

  private processIfFul() {
    if (this.items.length >= this.size) {
      this.processItems()

      this.clearExistingTimeout()
    }
  }

  processItems() {
    if (this.items.length > 0) {
      this.onFull([...this.items])
      this.items = []
    }
  }

  setExecuteCallback(callback: (items: Array<T>) => void) {
    this.onFull = callback
  }
}

export {Batcher}
