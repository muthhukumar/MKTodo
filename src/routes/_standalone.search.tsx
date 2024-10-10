import * as React from "react"
import {Outlet, createFileRoute, redirect, useNavigate} from "@tanstack/react-router"
import {StandAlonePage, Task} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {getCancelTokenSource} from "~/service/axios"
import {useDelay} from "~/utils/hooks"
import {SearchPageSchema} from "~/utils/schema"
import {taskQueue} from "~/utils/task-queue"

export const Route = createFileRoute("/_standalone/search")({
  component: Search,
  validateSearch: SearchPageSchema,
  loaderDeps: ({search: {query, from}}) => ({query, from}),
  loader: async ({deps: {query, from}}) => {
    const cancelToken = getCancelTokenSource()

    return {
      from: from || "/tasks/all",
      tasks: await taskQueue.enqueueUnique({
        task: () => API.getTasks(null, query, false, cancelToken),
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
  const navigate = useNavigate({from: location.pathname})

  const [search, cancel] = useDelay((query: string) => {
    navigate({search: {query}})
  }, 1200)

  const inputRef = React.useRef<HTMLInputElement>(null)

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (inputRef.current) {
      cancel()
      navigate({search: {query: inputRef.current.value}})
    }
  }

  return (
    <>
      <Outlet />
      <StandAlonePage
        title="Search"
        header={
          <StandAlonePage.HeaderWrapper>
            <StandAlonePage.GoBack goBackTo={from} />
            <form onSubmit={onSubmit}>
              <input
                ref={inputRef}
                autoFocus
                placeholder="search"
                className="outline-none text-white bg-inherit ml-5 text-lg w-full"
                onChange={e => {
                  search(e.target.value)
                }}
              />
            </form>
          </StandAlonePage.HeaderWrapper>
        }
      >
        <div className="flex flex-col gap-1">
          {tasks.map(t => {
            return <Task onToggle={() => undefined} {...t} key={t.id} type={"search"} />
          })}
        </div>
        <div className="min-h-[20vh]" />
      </StandAlonePage>
    </>
  )
}
