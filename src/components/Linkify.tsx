// TODO: refactor this component later
import * as React from "react"
import {invariant} from "~/utils/invariants"
import {LiaExternalLinkAltSolid} from "react-icons/lia"
import {API} from "~/service"
import {taskQueue} from "~/utils/task-queue"

function Link({href, preventNavigation = false}: {href: string; preventNavigation?: boolean}) {
  const [title, setTitle] = React.useState("")

  React.useEffect(() => {
    if (!title) {
      taskQueue
        .enqueue(API.fetchWebPageTitle.bind(null, href))
        .then(title => {
          if (title) setTitle(title)
          else setTitle(href)
        })
        .catch(() => setTitle(href))
    }
  }, [title, href])

  if (preventNavigation) {
    return (
      <span className="flex items-center gap-1 relative text-blue-400">
        {title || href}
        <a href={href} target="_blank" rel="noopener noreferrer" className="-mt-3 text-blue-400">
          <LiaExternalLinkAltSolid />
        </a>
      </span>
    )
  } else {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400">
        {title || href}
      </a>
    )
  }
}

function Linkify({
  children,
  preventNavigation = false,
}: {
  children: React.ReactNode
  preventNavigation?: boolean
}) {
  invariant(
    typeof children === "string",
    `children should be a link. Got ${JSON.stringify(children)}`,
    children,
  )

  const urlRegex = /(https?:\/\/[^\s]+)/g // TODO: we have to find another want to match url

  const parts = children.split(urlRegex).map(part => {
    if (!urlRegex.test(part)) {
      return part
    }

    return <Link preventNavigation={preventNavigation} href={part} key={part} />
  })

  return <span>{parts}</span>
}

export default React.memo(Linkify)
