import {createFileRoute, Outlet, redirect} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {getCancelTokenSource} from "~/service/axios"
import {SearchQuerySchema} from "~/utils/schema"
import {taskQueue} from "~/utils/task-queue"

export const Route = createFileRoute("/_auth/tasks/all")({
  validateSearch: SearchQuerySchema,
  loaderDeps: ({search: {query, random}}) => ({query, random}),
  loader: async ({deps: {query, random}}) => {
    const cancelToken = getCancelTokenSource()

    return {
      tasks: await taskQueue.enqueueUnique({
        task: () => API.getTasks(null, query, random, cancelToken),
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
  const {tasks} = Route.useLoaderData()

  return (
    <>
      <Outlet />
      <Tasks type="all" tasks={tasks} />
    </>
  )
}
