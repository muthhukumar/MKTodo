import {createFileRoute, redirect} from "@tanstack/react-router"
import {List} from "~/components"
import MobileCreateListInput from "~/components/MobileCreateListInput"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"

export const Route = createFileRoute("/_auth/lists")({
  loader: async () => {
    return {
      lists: await API.getLists(),
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
  component: ListsPage,
  errorComponent: ErrorMessage,
  pendingComponent: LoadingScreen,
})

function ListsPage() {
  const {lists} = Route.useLoaderData()

  return (
    <div className="px-3">
      <div className="py-3 sticky top-0 left-0 right-0 z-10 bg-background">
        <h2 className="font-bold text-2xl">Lists</h2>
      </div>
      <div className="mt-3 gap-1 flex flex-col">
        {lists.map(l => {
          return <List {...l} key={l.id} />
        })}
      </div>
      <MobileCreateListInput />
      <div className="h-[40vh]" />
    </div>
  )
}

