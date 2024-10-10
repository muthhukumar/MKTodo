import {Link, createFileRoute, redirect} from "@tanstack/react-router"
import {StandAlonePage, Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {getCancelTokenSource} from "~/service/axios"
//import {FromSchema} from "~/utils/schema"
import {taskQueue} from "~/utils/task-queue"

export const Route = createFileRoute("/_standalone/search")({
  component: Search,
  //validateSearch: FromSchema,
  //loaderDeps: ({search: {from}}) => ({from}),
  //loader: async ({deps: {from}}) => {
  loader: async () => {
    const cancelToken = getCancelTokenSource()

    return {
      from: "/settings",
      tasks: await taskQueue.enqueueUnique({
        task: () => API.getTasks(null, "", false, cancelToken),
        id: "fetchAllTasks",
        cancelTokenSource: cancelToken,
      }),
    }
  },
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
  errorComponent: ErrorMessage,
  pendingComponent: LoadingScreen,
})

function Search() {
  const {from, tasks} = Route.useLoaderData()

  return (
    <StandAlonePage
      title="Search"
      header={
        <StandAlonePage.HeaderWrapper>
          <StandAlonePage.GoBack goBackTo={from} />
          <input
            autoFocus
            placeholder="search"
            className="outline-none text-white bg-inherit ml-5 text-lg w-full"
          />
        </StandAlonePage.HeaderWrapper>
      }
    >
      <div className="flex flex-col gap-3">
        {tasks.map(t => {
          return (
            <Link to={`/tasks/all/${t.id}`}>
              <p key={t.id} className="border border-border rounded-md px-3 py-1">
                {t.name}
              </p>
            </Link>
          )
        })}
      </div>
    </StandAlonePage>
  )
}
