import * as React from "react"
import {Feature, getFeatureValueFromWindow} from "~/feature-context"
import {invariant} from "./invariants"

export function isActiveElement<T>(ref: React.RefObject<T>) {
  return ref.current === document.activeElement
}

class Notifier {
  constructor(
    public elementId: string,
    public featureId: Feature,
  ) {}

  get element() {
    const feature = getFeatureValueFromWindow(this.featureId)

    if (!feature?.enable) return null

    const el = document.getElementById(this.elementId)

    invariant(Boolean(el), "Element with ID %s cannot be null. But got %s", this.elementId, el)

    return el
  }

  show(message: string, options?: {duration?: number; autoClose?: boolean}) {
    if (!this.element) return

    this.element.style.display = "block"
    this.element.textContent = message

    const {duration = 4000, autoClose = true} = options || {}

    if (autoClose) {
      setTimeout(() => this.hide(), duration)
    }
  }

  hide() {
    if (!this.element) return

    this.element.style.display = "none"
    this.element.textContent = ""
  }
}

export const notifier = new Notifier("notifier", "Notifier")
export const syncNotifier = new Notifier("syncing", "SyncNotifier")

export function isWithInRange({
  range,
  curr,
  checkReverse = false,
}: {
  range: {start: number; end: number}
  curr: {start: number; end: number}
  checkReverse?: boolean
}) {
  if (checkReverse) {
    return curr.start <= range.end && curr.end >= range.start
  }

  return curr.start >= range.start && curr.end <= range.end
}
