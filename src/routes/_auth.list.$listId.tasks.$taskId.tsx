import {createFileRoute, useNavigate} from "@tanstack/react-router"
import Drawer from "~/components/Tasks/Drawer"
import {ErrorMessage} from "~/components/screens"
import {API} from "~/service"

export const Route = createFileRoute("/_auth/list/$listId/tasks/$taskId")({
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

  const navigate = useNavigate({from: "/tasks/$taskType/$taskId"})

  const goBack = () =>
    navigate({to: "/tasks/$taskType", params: {taskType: "all"}, search: {filter: "none"}})

  return <Drawer {...task} onDismiss={goBack} />
}
