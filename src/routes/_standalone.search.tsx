import * as React from "react"
import {Outlet, createFileRoute, redirect, useNavigate} from "@tanstack/react-router"
import {GoBack, StandAlonePage, Task} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {getCancelTokenSource} from "~/service/axios"
import {useDelay} from "~/utils/hooks"
import {SearchPageSchema} from "~/utils/schema"
import {taskQueue} from "~/utils/task-queue"

export const Route = createFileRoute("/_standalone/search")({
  component: Search,
  validateSearch: SearchPageSchema,
  loaderDeps: ({search: {query}}) => ({query}),
  loader: async ({deps: {query}}) => {
    const cancelToken = getCancelTokenSource()

    if (!query) return {tasks: [], query}

    return {
      query,
      tasks: await taskQueue.enqueueUnique({
        task: () =>
          API.getTasks({filter: null, query, cancelTokenSource: cancelToken, showAllTasks: true}),
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
  const {tasks, query} = Route.useLoaderData()
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
        {Boolean(query) && tasks.length === 0 && (
          <p className="font-semibold text-center mt-5">No result found</p>
        )}
        {!Boolean(query) && tasks.length <= 0 && (
          <p className="font-semibold text-center mt-5">Search something...</p>
        )}
        <div className="min-h-[20vh]" />
        <GoBack />
      </StandAlonePage>
    </>
  )
}
