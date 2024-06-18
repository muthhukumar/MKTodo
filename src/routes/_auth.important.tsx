import {createFileRoute} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {SearchQuerySchema} from "~/utils/schema"

export const Route = createFileRoute("/_auth/important")({
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

  return <Tasks tasks={tasks} />
}
