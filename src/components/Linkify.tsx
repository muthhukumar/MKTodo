// TODO: refactor this component later
import * as React from "react"
import {assert} from "~/utils/assert"

function Linkify({children}: {children: React.ReactNode}) {
  assert(typeof children === "string", "children should be a link")

  // TODO: validate the children here
  const urlRegex = /(https?:\/\/[^\s]+)/g // TODO: we have to find another want to match url

  const parts = children.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
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

    return part
  })

  return <span>{parts}</span>
}

export default React.memo(Linkify)
