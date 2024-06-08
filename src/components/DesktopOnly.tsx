import * as React from "react"
import {useSize} from "~/utils/hooks"

export default function DesktopOnly({children}: {children: React.ReactNode}) {
  const {isDesktop} = useSize()

  return isDesktop ? children : null
}
