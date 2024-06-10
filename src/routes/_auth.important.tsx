import {createFileRoute} from "@tanstack/react-router"
import {Tasks} from "~/components"

export const Route = createFileRoute("/_auth/important")({
  component: Tasks,
})
