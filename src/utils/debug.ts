import * as React from "react"

export const countRender = () => {
  const count = React.useRef(0)

  count.current = count.current + 1

  void console.log(`rerender count: `, count.current)
}
