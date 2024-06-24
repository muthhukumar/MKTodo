import {createFileRoute, Outlet} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {SearchQuerySchema} from "~/utils/schema"
import {ImportantTask} from "~/utils/tasks"

export const Route = createFileRoute("/_auth/tasks/important")({
  validateSearch: SearchQuerySchema,
  loaderDeps: ({search: {query}}) => ({query}),
  loader: async ({deps: {query}}) => {
    return {
      tasks: await API.getTasks("important", query),
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
      <Tasks
        type="important"
        tasks={tasks}
        createTask={task => new ImportantTask({name: task, important: true})}
      />
      <Outlet />
    </>
  )
}
