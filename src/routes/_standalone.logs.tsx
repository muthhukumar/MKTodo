import * as React from "react"
import {createFileRoute, redirect} from "@tanstack/react-router"
import clsx from "clsx"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {LogsSchema} from "~/utils/schema"
import {Divider, StandAlonePage} from "~/components"

export const Route = createFileRoute("/_standalone/logs")({
  validateSearch: LogsSchema,
  loaderDeps: ({search: {from}}) => ({from}),
  component: Logs,
  loader: async ({deps: {from}}) => {
    return {
      logs: await API.getLogs(),
      from,
    }
  },
  beforeLoad: ({context, location}) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      })
    }
  },
  errorComponent: ErrorMessage,
  pendingComponent: LoadingScreen,
})

function Logs() {
  const {logs, from} = Route.useLoaderData()
  const [logLevel, setLogLevel] = React.useState("")

  const filteredLogs = logLevel
    ? logs.filter(l => {
        return l.level.toLowerCase() === logLevel
      })
    : logs

  return (
    <StandAlonePage title="Logs" goBackTo={from}>
      <div className="w-full sticky top-12 left-0 right-0 bg-background py-1">
        <select value={logLevel} onChange={e => setLogLevel(e.target.value)}>
          <option value="" disabled>
            Select LogLevel
          </option>
          <option value="debug">debug</option>
          <option value="info">info</option>
          <option value="warn">warn</option>
          <option value="error">error</option>
        </select>
      </div>
      <Divider />
      <div className="flex flex-col gap-3">
        {filteredLogs.map(l => {
          const level = l.level.toLowerCase()
          return (
            <p key={l.id}>
              [{l.created_at}]{" "}
              <span
                className={clsx("font-bold", {
                  "text-blue-400": level === "debug",
                  "text-green-400": level === "info",
                  "text-yellow-400": level === "warn",
                  "text-red-400": level === "error",
                })}
              >
                [{level}]
              </span>{" "}
              [{l.log}]
            </p>
          )
        })}
      </div>
    </StandAlonePage>
  )
}
