import "../App.css"
import "../tailwind.css"
import "../css-reset.css"
import "../modal.css"

import {Outlet, createRootRouteWithContext} from "@tanstack/react-router"
import {AuthContext} from "~/auth-context"

interface MyRouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return <Outlet />
}
