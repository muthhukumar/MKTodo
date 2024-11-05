import {createFileRoute, useNavigate} from "@tanstack/react-router"
import Drawer from "~/components/Tasks/Drawer"
import {ErrorMessage} from "~/components/screens"
import {API} from "~/service"

export const Route = createFileRoute("/_auth/tasks/$taskType/$taskId")({
  loader: async ({params: {taskId}}) => {
    return {
      lists: await API.getLists(),
      ...(await API.getTask(Number(taskId))),
    }
  },
  component: TaskDetail,
  errorComponent: ErrorMessage,
})

function TaskDetail() {
  const task = Route.useLoaderData()
  const {taskType} = Route.useParams()

  const navigate = useNavigate({from: "/tasks/$taskType/$taskId"})

  const goBack = () =>
    navigate({to: "/tasks/$taskType", params: {taskType}, search: {filter: "none"}})

  return <Drawer {...task} onDismiss={goBack} />
}
