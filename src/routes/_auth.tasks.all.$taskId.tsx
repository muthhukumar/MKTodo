import {createFileRoute, useNavigate} from "@tanstack/react-router"
import Drawer from "~/components/Tasks/Drawer"
import {ErrorMessage} from "~/components/screens"
import {API} from "~/service"

export const Route = createFileRoute("/_auth/tasks/all/$taskId")({
  loader: async ({params: {taskId}}) => {
    return {
      ...(await API.getTask(Number(taskId))),
    }
  },
  component: TaskDetail,
  errorComponent: ErrorMessage,
})

function TaskDetail() {
  const task = Route.useLoaderData()

  const navigate = useNavigate({from: "/tasks/all/$taskId"})

  const goBack = () => navigate({to: "/tasks/all", search: {query: "", random: false}})

  return <Drawer {...task} onDismiss={goBack} />
}
