import {createFileRoute, redirect} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {API} from "~/service"

export const Route = createFileRoute("/_auth/")({
  loader: async () => {
    return {
      tasks: await API.getTasks(null),
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
})

function AllTasks() {
  const {tasks} = Route.useLoaderData()

  return <Tasks tasks={tasks} />
}
