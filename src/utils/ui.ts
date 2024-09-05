import * as React from "react"

export function isActiveElement<T>(ref: React.RefObject<T>) {
  return ref.current === document.activeElement
}
