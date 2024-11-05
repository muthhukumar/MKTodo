import * as React from "react"
import {Outlet, createFileRoute, redirect, useNavigate, useRouter} from "@tanstack/react-router"
import clsx from "clsx"
import {FaPlus} from "react-icons/fa6"
import {MdOutlineArrowBackIos} from "react-icons/md"
import {DesktopOnly, List, MobileOnly} from "~/components"
import MobileCreateListInput from "~/components/Lists/MobileCreateListInput"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {handleError} from "~/utils/error"
import {useOnSwipe, useSize} from "~/utils/hooks"
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

  const isShowingTasks =
    router.state.location.href.includes("lists") && router.state.location.href.includes("tasks")

  const {isMobile} = useSize()

  const navigate = useNavigate()

  const inputRef = React.useRef<HTMLInputElement>(null)

  async function createList(event: React.FormEvent) {
    event.preventDefault()

    const listName = inputRef.current?.value ?? ""

    if (listName.length < 3) return

    try {
      await API.createList(listName)

      if (inputRef.current) inputRef.current.value = ""

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Failed to create list"})
    }
  }

  return (
    <div className="w-full flex h-screen">
      <div
        className={clsx("relative border-r border-border px-3 mr-2 min-w-[40%]", {
          "hidden": isMobile && isShowingTasks,
          "min-w-full": isMobile && !isShowingTasks,
        })}
      >
        <div className="py-3 sticky top-0 left-0 right-0 z-10 bg-background">
          <h2 className="font-bold text-2xl">Lists</h2>
        </div>
        <div className="mt-1 gap-1 flex flex-col max-h-[85vh] overflow-y-scroll pb-52 hide-scrollbar">
          {lists.map(l => {
            return <List {...l} key={l.id} />
          })}
        </div>
        <MobileOnly>
          <MobileCreateListInput />
        </MobileOnly>

        <DesktopOnly>
          <form
            onSubmit={createList}
            className="max-w-[95%] mx-auto mb-3 absolute bottom-0 left-0 right-0 border border-border focus-within:ring-2 focus-within:ring-blue-500 rounded-md flex items-center w-full bg-item-background"
          >
            <FaPlus className="mx-3" />
            <input
              ref={inputRef}
              type="text"
              name="List"
              title="List"
              className="outline-none w-full text-white rounded-md px-2 py-3 bg-item-background"
              placeholder="Add a List"
            />
          </form>
        </DesktopOnly>
      </div>
      <div className="w-full h-screen overflow-y-scroll">
        <Outlet />
      </div>
      {isMobile && isShowingTasks && (
        <button
          onClick={() => navigate({to: "/lists"})}
          className="left-6 fixed bottom-20 p-3 backdrop-blur-sm rounded-full bg-border flex items-center justify-center"
        >
          <MdOutlineArrowBackIos />
        </button>
      )}
    </div>
  )
}
