import {createFileRoute, Outlet, redirect} from "@tanstack/react-router"
import {ErrorMessage} from "~/components/screens"

export const Route = createFileRoute("/_auth/")({
  beforeLoad: ({context}) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/tasks/$taskType",
        params: {
          taskType: "all",
        },
        search: {
          filter: "none",
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
