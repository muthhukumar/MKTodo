// import * as React from "react"
import {createFileRoute, Outlet, redirect} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {getCancelTokenSource} from "~/service/axios"
import {taskQueue} from "~/utils/task-queue"
// import {TasksStore} from "~/utils/persistent-storage"
import {uuid} from "~/utils"

export const Route = createFileRoute("/_auth/tasks/all")({
  loader: async () => {
    // const offlineTasks = await TasksStore.get()

    //if (Array.isArray(offlineTasks) && offlineTasks.length > 0)
    //  return {
    //    tasks: offlineTasks,
    //    source: "offline" as const,
    //    id: uuid(),
    //  }

    const cancelToken = getCancelTokenSource()

    return {
      id: uuid(),
      source: "online" as const,
      tasks: await taskQueue.enqueueUnique({
        task: () => API.getTasks(null, "", false, cancelToken),
        id: "fetchAllTasks",
        cancelTokenSource: cancelToken,
      }),
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
  component: AllTasks,
  errorComponent: ErrorMessage,
  pendingComponent: LoadingScreen,
})

function AllTasks() {
  const loaderData = Route.useLoaderData()
  // const [tasks, setTasks] = React.useState(loaderData.tasks)
  // const [source, setSource] = React.useState(loaderData.source)

  //React.useEffect(() => {
  //  async function fetchOnlineTasks() {
  //    const cancelToken = getCancelTokenSource()
  //
  //    try {
  //      const tasks = await taskQueue.enqueueUnique({
  //        task: () => API.getTasks(null, "", false, cancelToken),
  //        id: "fetchAllTasks",
  //        cancelTokenSource: cancelToken,
  //      })
  //
  //      setTasks(tasks)
  //      setSource("online")
  //    } catch {}
  //  }
  //
  //  if (source === "offline") {
  //    fetchOnlineTasks()
  //  }
  //}, [source, loaderData.id])

  return (
    <>
      <Outlet />
      <Tasks type="all" tasks={loaderData.tasks} source={"online"} />
    </>
  )
}
