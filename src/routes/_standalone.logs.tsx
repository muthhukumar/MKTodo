import {createFileRoute, redirect} from "@tanstack/react-router"
import clsx from "clsx"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {LogsSchema} from "~/utils/schema"
import {StandAlonePage} from "~/components"

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

  return (
    <StandAlonePage title="Logs" goBackTo={from}>
      <div
        className="flex flex-col gap-3"
        onDrag={() => {
          console.log("dragging")
        }}
      >
        {logs.map(l => {
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
