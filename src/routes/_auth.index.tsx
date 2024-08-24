import {createFileRoute, Outlet, redirect} from "@tanstack/react-router"
import {ErrorMessage} from "~/components/screens"

export const Route = createFileRoute("/_auth/")({
  beforeLoad: ({context}) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/tasks/all",
        search: {
          random: false,
          query: "",
        },
      })
    }
  },
  component: AllTasks,
  errorComponent: ErrorMessage,
})

function AllTasks() {
  return <Outlet />
}
