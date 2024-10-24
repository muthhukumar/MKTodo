import {createFileRoute, Outlet, redirect, useNavigate, useRouter} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {getCancelTokenSource} from "~/service/axios"
import {taskQueue} from "~/utils/task-queue"
// import {TasksStore} from "~/utils/persistent-storage"
import {getTaskPageMetaData} from "~/utils/tasks"
import {useAsyncFilteredTasks} from "~/utils/tasks/hooks"
import {z} from "zod"
import {useOnSwipe} from "~/utils/hooks"
import {notifier} from "~/utils/ui"
import {getFeatureValueFromWindow} from "~/feature-context"

const plannedFilter = z.object({
  filter: z
    .enum([
      "all-planned",
      "overdue",
      "today",
      "tomorrow",
      "this-week",
      "later",
      "none",
      "recurring",
    ])
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
      tasks: await taskQueue.enqueue(() =>
        API.getTasks({
          filter: metadata.filter,
          query: "",
          cancelTokenSource: cancelToken,
          showAllTasks: [
            "my-day",
            "important",
            "all-planned",
            "overdue",
            "today",
            "tomorrow",
            "this-week",
            "later",
            "recurring",
          ].includes(taskType),
        }),
      ),
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

const routeLeftMap = {
  "all": "planned",
  "planned": "my-day",
}

const routeRightMap = {
  "planned": "all",
  "my-day": "planned",
}

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
    dueDateFilter: filter === "none" ? "all-planned" : filter,
    tasks,
  })

  tasks = taskType === "planned" ? filteredTasks : tasks

  const router = useRouter()

  const navigate = useNavigate()

  useOnSwipe(
    {
      enable: getFeatureValueFromWindow("SwipeNavigation")?.enable,
      ranges: [
        {
          id: "swipe-to-right",
          minDistancePercentage: 35,
          range: [15, 85],
          callback: () => {
            const next = routeRightMap[taskType as keyof typeof routeRightMap]

            if (next)
              navigate({
                to: "/tasks/$taskType",
                search: {filter: "none"},
                params: {taskType: next},
              })
          },
          axis: "x",
          reverse: false,
        },
        {
          id: "swipe-to-left",
          minDistancePercentage: 35,
          range: [15, 85],
          callback: () => {
            const next = routeLeftMap[taskType as keyof typeof routeLeftMap]

            if (next)
              navigate({
                to: "/tasks/$taskType",
                search: {filter: "none"},
                params: {taskType: next},
              })
          },
          axis: "x",
          reverse: true,
        },
      ],
    },
    [taskType],
  )

  useOnSwipe(
    {
      enable: getFeatureValueFromWindow("PullToRefresh")?.enable,
      ranges: [
        {
          id: "pull-to-refresh-tasks",
          minDistancePercentage: 35,
          range: [10, 90],
          callback: () => {
            router.invalidate()
            notifier.show("Refreshing")
          },
          axis: "y",
          reverse: false,
        },
      ],
    },
    [taskType],
  )

  return (
    <>
      <Outlet />
      <Tasks {...props} tasks={tasks} autoCompletionData={autoCompletionData} />
    </>
  )
}
