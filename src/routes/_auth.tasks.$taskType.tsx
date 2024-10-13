// import * as React from "react"
import {createFileRoute, Outlet, redirect} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {getCancelTokenSource} from "~/service/axios"
import {taskQueue} from "~/utils/task-queue"
// import {TasksStore} from "~/utils/persistent-storage"
import {uuid} from "~/utils"
import {getTaskPageMetaData} from "~/utils/tasks"
import {useAsyncFilteredTasks} from "~/utils/tasks/hooks"
import {z} from "zod"

const plannedFilter = z.object({
  filter: z
    .enum(["all-planned", "overdue", "today", "tomorrow", "this-week", "later", "none"])
    .catch("all-planned")
    .default("all-planned"),
})

export const Route = createFileRoute("/_auth/tasks/$taskType")({
  validateSearch: plannedFilter,
  loader: async ({params: {taskType}}) => {
    // const offlineTasks = await TasksStore.get()

    //if (Array.isArray(offlineTasks) && offlineTasks.length > 0)
    //  return {
    //    tasks: offlineTasks,
    //    source: "offline" as const,
    //    id: uuid(),
    //  }

    const cancelToken = getCancelTokenSource()
    const metadataCancelToken = getCancelTokenSource()
    const metadata = getTaskPageMetaData(taskType)

    return {
      id: uuid(),
      source: "online" as const,
      tasks: await taskQueue.enqueue(() => API.getTasks(metadata.filter, "", cancelToken)),
      metadata: await taskQueue.enqueue(() => API.getTasksNames(metadataCancelToken)),
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
  let {tasks, metadata} = Route.useLoaderData()
  const {taskType} = Route.useParams()
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

  const props = getTaskPageMetaData(taskType)
  const {filter} = Route.useSearch()

  const filteredTasks = useAsyncFilteredTasks({
    query: "",
    dueDateFilter: filter,
    tasks,
  })

  tasks = taskType === "planned" ? filteredTasks : tasks

  return (
    <>
      <Outlet />
      <Tasks {...props} tasks={tasks} source={"online"} metadata={metadata} />
    </>
  )
}
