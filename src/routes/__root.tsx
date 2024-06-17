import "../App.css"
import "../tailwind.css"
import "../css-reset.css"
import "../modal.css"

import {Outlet, createRootRouteWithContext} from "@tanstack/react-router"
import {AuthContextType} from "~/auth-context"

interface MyRouterContext {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return <Outlet />
}
