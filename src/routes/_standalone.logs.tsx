import * as React from "react"
import {createFileRoute, redirect, useNavigate, useRouter} from "@tanstack/react-router"
import clsx from "clsx"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {Divider, StandAlonePage} from "~/components"
import {format24Hour} from "~/utils/date"
import {logger} from "~/utils/logger"
import {AiOutlinePlus} from "react-icons/ai"
import {Log} from "~/@types"
import {handleError} from "~/utils/error"
import {createTask} from "~/utils/tasks"
import toast from "react-hot-toast"
import {invariant} from "~/utils/invariants"
import {useOnMousePull} from "~/utils/hooks"

export const Route = createFileRoute("/_standalone/logs")({
  component: Logs,
  loader: async () => {
    return {
      logs: await API.getLogs(),
      queuedLogs: logger.queuedLogs(),
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
  const {logs, queuedLogs} = Route.useLoaderData()
  const [logLevel, setLogLevel] = React.useState("")

  const router = useRouter()
  const navigate = useNavigate()

  const filteredLogs = logLevel
    ? logs.filter(l => {
        return l.level.toLowerCase() === logLevel
      })
    : logs

  async function createTaskFromLog(log: Log) {
    try {
      const response = await API.createTask(createTask("all", `${log.level}: ${log.log}`))

      invariant(response.id >= 0, "Task id should not be empty. Got %s", response.id)

      toast.success("Created Task from log successfully.")

      setTimeout(() => {
        navigate({
          to: "/tasks/$taskType/$taskId",
          params: {taskId: String(response.id), taskType: "all"},
          search: {filter: "none"},
        })
      }, 500)
    } catch (error) {
      handleError({error, defaultMessage: "Failed to create task from log"})
    }
  }

  const containerRef = React.useRef<HTMLDivElement>(null)

  useOnMousePull({ref: containerRef, pullThresholdPercentage: 30}, router.invalidate)

  return (
    // TODO: remove this div and pass the ref directly to the standalone page
    <div ref={containerRef}>
      <StandAlonePage title="Logs">
        <p className="text-center my-2">
          Total <strong>{filteredLogs.length}</strong> logs found
        </p>
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
          <button
            onClick={() => router.invalidate()}
            className="text-black bg-white rounded-md px-3 ml-2"
          >
            Refresh
          </button>
        </div>
        <Divider />
        <div>
          <p className="font-bold text-lg mb-2">Queued Logs</p>
          <div className="flex flex-col gap-3">
            {queuedLogs.length === 0 && <p>No logs queued</p>}
            {queuedLogs.map((l, idx) => {
              const level = l.level.toLowerCase()
              return (
                <p key={idx} className="break-all">
                  <span className="font-bold">[{format24Hour(l.created_at)}] </span>
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
                  <span className="text-zinc-300">{l.log}</span>
                </p>
              )
            })}
          </div>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          {filteredLogs.map(l => {
            const level = l.level.toLowerCase()
            return (
              <div key={l.id} className="break-all">
                <button className="mr-1" onClick={() => createTaskFromLog(l)}>
                  <AiOutlinePlus />
                </button>
                <span className="font-bold">[{format24Hour(l.created_at)}] </span>
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
                <span className="text-zinc-300">{l.log}</span>
              </div>
            )
          })}
        </div>
      </StandAlonePage>
    </div>
  )
}
