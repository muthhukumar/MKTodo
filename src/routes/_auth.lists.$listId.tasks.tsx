import {createFileRoute, Outlet, redirect} from "@tanstack/react-router"
import {TaskTypes} from "~/@types"
import {Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {getCancelTokenSource} from "~/service/axios"
import {taskQueue} from "~/utils/task-queue"

export const Route = createFileRoute("/_auth/lists/$listId/tasks")({
  loader: async ({params: {listId}}) => {
    const cancelToken = getCancelTokenSource()
    const metadataCancelToken = getCancelTokenSource()

    return {
      list: await API.getList(listId),
      tasks: await taskQueue.enqueue(() =>
        API.getTasks({
          filter: null,
          query: "",
          cancelTokenSource: cancelToken,
          listId,
          showAllTasks: false,
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

function AllTasks() {
  const {tasks, autoCompletionData, list} = Route.useLoaderData()

  return (
    <>
      <Outlet />
      <Tasks
        title={list.name}
        listId={list.id}
        type={"list" as TaskTypes}
        tasks={tasks}
        autoCompletionData={autoCompletionData}
      />
    </>
  )
}
