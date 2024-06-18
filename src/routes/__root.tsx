import "../App.css"
import "../tailwind.css"
import "../css-reset.css"
import "../modal.css"

import {Outlet, createRootRouteWithContext} from "@tanstack/react-router"
import {AuthContextType} from "~/auth-context"
import {ErrorMessage} from "~/components/screens"

interface MyRouterContext {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  errorComponent: ErrorMessage,
})

function RootComponent() {
  return <Outlet />
}
