import {createFileRoute, useNavigate} from "@tanstack/react-router"
import Drawer from "~/components/Tasks/Drawer"
import {ErrorMessage} from "~/components/screens"
import {API} from "~/service"
import {FromSchema} from "~/utils/schema"

export const Route = createFileRoute("/_standalone/search/$taskId")({
  validateSearch: FromSchema,
  loaderDeps: ({search: {from}}) => ({from}),
  loader: async ({params: {taskId}, deps: {from}}) => {
    return {
      lists: await API.getLists(),
      task: await API.getTask(Number(taskId)),
      from,
    }
  },
  component: TaskDetail,
  errorComponent: ErrorMessage,
})

function TaskDetail() {
  const {task, from, lists} = Route.useLoaderData()

  const navigate = useNavigate()

  const goBack = () => navigate({to: from, search: {query: ""}})

  return <Drawer {...task} onDismiss={goBack} lists={lists} />
}
