import {createFileRoute, Outlet, redirect} from "@tanstack/react-router"
import {ErrorMessage} from "~/components/screens"

export const Route = createFileRoute("/_standalone")({
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
  component: Auth,
  errorComponent: ErrorMessage,
})

function Auth() {
  return <Outlet />
}
