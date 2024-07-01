import {createFileRoute, Outlet, redirect} from "@tanstack/react-router"
import {DesktopOnly, MobileBottomNavbar, MobileOnly, Sidebar} from "~/components"
import {ErrorMessage} from "~/components/screens"

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
  errorComponent: ErrorMessage,
})

function Auth() {
  return (
    <div className="h-screen md:flex">
      <DesktopOnly>
        <Sidebar />
        <Outlet />
      </DesktopOnly>
      <MobileOnly>
        <Outlet />
        <MobileBottomNavbar />
      </MobileOnly>
    </div>
  )
}
