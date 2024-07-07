import {createFileRoute, Outlet} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {SearchQuerySchema} from "~/utils/schema"

export const Route = createFileRoute("/_auth/tasks/my-day")({
  validateSearch: SearchQuerySchema,
  loaderDeps: ({search: {query}}) => ({query}),
  loader: async ({deps: {query}}) => {
    return {
      tasks: await API.getTasks("my-day", query),
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
