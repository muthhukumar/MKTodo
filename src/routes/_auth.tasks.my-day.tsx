import {createFileRoute, Outlet} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {getCancelTokenSource} from "~/service/axios"
import {taskQueue} from "~/utils/task-queue"

export const Route = createFileRoute("/_auth/tasks/my-day")({
  loader: async () => {
    const cancelToken = getCancelTokenSource()

    return {
      tasks: await taskQueue.enqueueUnique({
        task: () => API.getTasks("my-day", "", false, cancelToken),
        id: "fetchMyDayTasks",
        cancelTokenSource: cancelToken,
      }),
    }
  },
  component: MyDayTasks,
  errorComponent: ErrorMessage,
  pendingComponent: LoadingScreen,
})

function MyDayTasks() {
  const {tasks} = Route.useLoaderData()

  return (
    <>
      <Outlet />
      <Tasks type="my-day" title="My Day" tasks={tasks} />
    </>
  )
}
