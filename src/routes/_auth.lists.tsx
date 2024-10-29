import {createFileRoute, redirect, useRouter} from "@tanstack/react-router"
import {List, MobileOnly} from "~/components"
import MobileCreateListInput from "~/components/Lists/MobileCreateListInput"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {useOnSwipe} from "~/utils/hooks"
import {notifier} from "~/utils/ui"

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

  const router = useRouter()

  useOnSwipe(
    {
      enable: window.featureManager.isEnabled("PullToRefresh"),
      ranges: [
        {
          id: "pull-to-refresh-lists",
          minDistancePercentage: 35,
          range: [10, 90],
          callback: () => {
            router.invalidate()
            notifier.show("Refreshing")
          },
          axis: "y",
          reverse: false,
        },
      ],
    },
    [],
  )

  return (
    <div className="px-3">
      <div className="py-3 sticky top-0 left-0 right-0 z-10 bg-background">
        <h2 className="font-bold text-2xl">Lists</h2>
      </div>
      <div className="mt-1 gap-1 flex flex-col">
        {lists.map(l => {
          return <List {...l} key={l.id} />
        })}
      </div>
      <MobileOnly>
        <MobileCreateListInput />
      </MobileOnly>
      <div className="h-[40vh]" />
    </div>
  )
}
