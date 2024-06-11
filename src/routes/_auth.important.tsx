import {createFileRoute} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {API} from "~/service"

export const Route = createFileRoute("/_auth/important")({
  loader: async () => {
    return {
      tasks: await API.getTasks("important"),
    }
  },
  // TODO - render the error component here
  component: ImportantTasks,
})

function ImportantTasks() {
  const {tasks} = Route.useLoaderData()

  return <Tasks tasks={tasks} />
}
