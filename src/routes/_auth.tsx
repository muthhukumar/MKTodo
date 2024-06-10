import {createFileRoute, Outlet, redirect} from "@tanstack/react-router"
import {DesktopOnly, Sidebar} from "~/components"

export const Route = createFileRoute("/_auth")({
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
})

function Auth() {
  return (
    <div className="h-screen flex">
      <DesktopOnly>
        <Sidebar />
      </DesktopOnly>
      <Outlet />
    </div>
  )
}
