import {createFileRoute} from "@tanstack/react-router"
import {Tasks} from "~/components"
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
  // TODO - render the error component here
  component: ImportantTasks,
})

function ImportantTasks() {
  const {tasks} = Route.useLoaderData()

  return <Tasks tasks={tasks} />
}
