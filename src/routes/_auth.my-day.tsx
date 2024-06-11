import {createFileRoute} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {API} from "~/service"

export const Route = createFileRoute("/_auth/my-day")({
  loader: async () => {
    return {
      tasks: await API.getTasks("my-day"),
    }
  },
  component: MyDayTasks,
})

function MyDayTasks() {
  const {tasks} = Route.useLoaderData()

  return <Tasks tasks={tasks} />
}
