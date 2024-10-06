import {Link, createFileRoute, redirect} from "@tanstack/react-router"
import clsx from "clsx"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {IoArrowBackSharp} from "react-icons/io5"

export const Route = createFileRoute("/_auth/logs")({
  component: Logs,
  loader: async () => {
    return await API.getLogs()
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
  const logs = Route.useLoaderData()

  return (
    <div className="p-3">
      <div className="flex items-center gap-3 mb-3">
        <Link to="/settings">
          <IoArrowBackSharp />
        </Link>
        <h3 className="font-bold text-xl">Logs</h3>
      </div>
      <div className="flex flex-col gap-3">
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
    </div>
  )
}

