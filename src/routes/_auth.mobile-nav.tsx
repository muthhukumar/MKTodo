import {createFileRoute} from "@tanstack/react-router"
import {Sidebar} from "~/components"

export const Route = createFileRoute("/_auth/mobile-nav")({
  component: Nav,
})

function Nav() {
  return <Sidebar className="w-full" />
}
