import * as React from "react"
import {createFileRoute, Outlet, redirect, useRouter} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {getCancelTokenSource} from "~/service/axios"
import {taskQueue} from "~/utils/task-queue"
// import {TasksStore} from "~/utils/persistent-storage"
import {getTaskPageMetaData} from "~/utils/tasks"
import {useAsyncFilteredTasks} from "~/utils/tasks/hooks"
import {z} from "zod"
import {useOnMousePull} from "~/utils/hooks"
import {notifier} from "~/utils/ui"
import {useEnabledFeatureCallback} from "~/feature-context"

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
      source: "online" as const,
      tasks: await taskQueue.enqueue(() => API.getTasks(metadata.filter, "", cancelToken)),
      autoCompletionData: await taskQueue.enqueue(() => API.getTasksNames(metadataCancelToken)),
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
  let {tasks, autoCompletionData} = Route.useLoaderData()
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

  const containerRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  const refresh = useEnabledFeatureCallback("PullToRefresh", () => {
    router.invalidate()

    notifier.show("Refreshing")
  })

  useOnMousePull({ref: containerRef}, refresh)

  return (
    <div ref={containerRef}>
      <Outlet />
      <Tasks {...props} tasks={tasks} autoCompletionData={autoCompletionData} />
    </div>
  )
}
