// TODO: refactor this component later
import * as React from "react"
import {assert} from "~/utils/assert"

function Linkify({
  children,
  preventNavigation = false,
}: {
  children: React.ReactNode
  preventNavigation?: boolean
}) {
  assert(typeof children === "string", "children should be a link")

  // TODO: validate the children here
  const urlRegex = /(https?:\/\/[^\s]+)/g // TODO: we have to find another want to match url

  const parts = children.split(urlRegex).map((part, index) => {
    if (!urlRegex.test(part)) {
      return part
    }

    if (preventNavigation) {
      return (
        <span key={index} className="text-blue-400">
          {part}
        </span>
      )
    } else {
      return (
        <a
          href={part}
          key={index}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400"
        >
          {part}
        </a>
      )
    }
  })

  return <span>{parts}</span>
}

export default React.memo(Linkify)
