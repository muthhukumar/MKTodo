// TODO: refactor this component later
import * as React from "react"
import {invariant} from "~/utils/invariants"
import {LiaExternalLinkAltSolid} from "react-icons/lia"

function Linkify({
  children,
  preventNavigation = false,
}: {
  children: React.ReactNode
  preventNavigation?: boolean
}) {
  invariant(typeof children === "string", "children should be a link")

  // TODO: validate the children here
  const urlRegex = /(https?:\/\/[^\s]+)/g // TODO: we have to find another want to match url

  const parts = children.split(urlRegex).map((part, index) => {
    if (!urlRegex.test(part)) {
      return part
    }

    if (preventNavigation) {
      return (
        <span key={index} className="flex items-center gap-1 relative text-blue-400">
          {part}
          <a
            href={part}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
            className="-mt-3 text-blue-400"
          >
            <LiaExternalLinkAltSolid />
          </a>
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
