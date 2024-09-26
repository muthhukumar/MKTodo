import {createFileRoute, Outlet} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {getCancelTokenSource} from "~/service/axios"
import {SearchQuerySchema} from "~/utils/schema"
import {taskQueue} from "~/utils/task-queue"

export const Route = createFileRoute("/_auth/tasks/important")({
  validateSearch: SearchQuerySchema,
  loaderDeps: ({search: {query}}) => ({query}),
  loader: async ({deps: {query}}) => {
    const cancelToken = getCancelTokenSource()

    return {
      tasks: await taskQueue.enqueueUnique({
        task: () => API.getTasks("important", query, false, cancelToken),
        // TODO: ID should contain query
        id: "fetchImportantTasks",
        cancelTokenSource: cancelToken,
      }),
    }
  },
  component: ImportantTasks,
  errorComponent: ErrorMessage,
  pendingComponent: LoadingScreen,
})

function ImportantTasks() {
  const {tasks} = Route.useLoaderData()

  return (
    <>
      <Outlet />
      <Tasks type="important" title="Important" tasks={tasks} />
    </>
  )
}
