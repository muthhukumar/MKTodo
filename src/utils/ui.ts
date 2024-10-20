import * as React from "react"
import {invariant} from "./invariants"

export function isActiveElement<T>(ref: React.RefObject<T>) {
  return ref.current === document.activeElement
}

class Notifier {
  constructor(public elementId: string) {}

  get element() {
    const el = document.getElementById(this.elementId)

    invariant(Boolean(el), "Element with ID %s cannot be null. But got %s", this.elementId, el)

    if (!el) throw new Error("Element cannot be empty")

    return el
  }

  show(message: string, options?: {duration?: number; autoClose?: boolean}) {
    this.element.style.display = "block"
    this.element.textContent = message

    const {duration = 4000, autoClose = true} = options || {}

    if (autoClose) {
      setTimeout(() => {
        this.element.style.display = "none"
      }, duration)
    }
  }

  hide() {
    this.element.style.display = "none"
    this.element.textContent = ""
  }
}

export const notifier = new Notifier("notifier")
