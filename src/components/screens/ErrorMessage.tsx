import * as React from "react"
import {ErrorComponentProps} from "@tanstack/react-router"
import clsx from "clsx"
import {usePing} from "~/utils/hooks"
import ErrorBoundary from "./ErrorBoundary"
import {logger} from "~/utils/logger"
import Logout from "../Logout"

export default function ErrorMessage(props: ErrorComponentProps) {
  const online = usePing()

  React.useEffect(() => {
    if (props.error) {
      logger.error(
        `
ErrorMessage: \n
[name: ${props.error.name}],
[message: ${props.error.message}],
[stack: ${props.error.stack}],
[info: ${props.info?.componentStack}],
`,
      )
    }
  }, [props])

  return (
    <ErrorBoundary>
      <div className="relative flex items-center justify-center flex-col p-3 h-screen w-full">
        {online !== null && (
          <>
            <p
              className={clsx("mb-5 px-4 py-1 border border-border rounded-full", {
                "text-green-400 border-green-400": online.internet,
                "text-red-400 border-red-400": !online.internet,
              })}
            >
              Internet is {online.internet ? "Online" : "Offline"}
            </p>
            <p
              className={clsx("mb-5 px-4 py-1 border border-border rounded-full", {
                "text-green-400 border-green-400": online.server,
                "text-red-400 border-red-400": !online.server,
              })}
            >
              Server is {online.server ? "Online" : "Offline"}
            </p>
          </>
        )}
        <h2 className="font-bold text-4xl mb-4">Well, this is awkward</h2>
        <div className="flex flex-col gap-3 text-zinc-400">
          <p>Looks like MKTodo has crashed unexpectedly...</p>
          <p>We've tracked the error and will get right on it.</p>
          <details className="border border-border rounded-md p-3">
            <summary>{props.error.name}</summary>
            <p>
              <strong>Message:</strong> {props.error.message}
            </p>
            <code>{props.error.stack}</code>
            <code>{props.info?.componentStack}</code>
          </details>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="border border-zinc-600 rounded-md px-3 py-1 mt-8"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
          <div className="mt-8">
            <Logout />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
