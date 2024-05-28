import * as React from "react"
import {useSize} from "../utils/hooks"

export default function MobileOnly({children}: {children: React.ReactNode}) {
  const {isMobile} = useSize()

  return isMobile ? children : null
}
