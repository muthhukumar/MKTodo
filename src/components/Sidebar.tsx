import clsx from "clsx"
import {useTasks} from "~/context"
import {timeAgo} from "~/utils/date"
import {MdOutlineWbSunny} from "react-icons/md"
import {CiStar} from "react-icons/ci"
import {IconType} from "react-icons"
import {TbHomeCheck} from "react-icons/tb"
import {useDelayedLoading, useReRenderOnPopState} from "~/utils/hooks"
import {CiCalendarDate} from "react-icons/ci"
import Spinner from "./Spinner"
import {RiCloseCircleFill} from "react-icons/ri"
import {IoSearchOutline} from "react-icons/io5"
import {APIStore} from "~/utils/tauri-store"

function IconLink({Icon, title, path}: {Icon: IconType; title: string; path: string}) {
  const {tasks} = useTasks()

  useReRenderOnPopState()

  function navigateTo() {
    window.history.pushState(null, "", path)
    window.dispatchEvent(new Event("popstate"))
  }

  const isActivePath = window.location.pathname === path

  return (
    <div
      className={clsx(
        "relative hover:cursor-pointer flex items-center hover:bg-highlight-black px-1 py-1 rounded-md",
        {
          "bg-highlight-black": isActivePath,
        },
      )}
      onClick={navigateTo}
    >
      <div className="flex-[0.1]">
        <Icon size={20} />
      </div>
      <div className="flex-[0.9]">
        <p className="text-sm">{title}</p>
      </div>
      {isActivePath && (
        <span className={clsx("delayed-element text-xs absolute right-3")}>{tasks.length}</span>
      )}
    </div>
  )
}

export default function Sidebar() {
  const {query, setQuery, reset} = useTasks()

  async function chooseDifferentServer() {
    try {
      await APIStore.reset()

      reset()
    } catch (error) {
      console.log("failed to choose different server", error)
    }
  }

  return (
    <div className="h-screen relative w-1/4 max-w-md py-8 bg-mid-black border-r-2 border-blak">
      <div className="px-3">
        <div className="focus-within:ring-2 focus-within:ring-blue-500 px-1 flex items-center gap-3 border border-zinc-700 rounded-md  bg-light-black">
          <IoSearchOutline size={22} />
          <input
            className="outline-none text-sm rounded-md py-1 w-full bg-light-black"
            placeholder="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button onClick={() => setQuery("")}>
            <RiCloseCircleFill size={22} />
          </button>
        </div>
        <div className="flex-col flex gap-2 mt-5">
          <IconLink Icon={MdOutlineWbSunny} title="My Day" path="/my-day" />
          <IconLink Icon={CiStar} title="Important" path="/important" />
          <IconLink Icon={CiCalendarDate} title="Planned" path="/planned" />
          <IconLink Icon={TbHomeCheck} title="Tasks" path="/" />
        </div>
        <button
          className="border border-light-black rounded-md px-3 py-2 w-full mt-5"
          onClick={chooseDifferentServer}
        >
          Choose different server
        </button>

        <LastSynced />
      </div>
    </div>
  )
}

function LastSynced() {
  const {syncStatus, loading} = useTasks()
  const isLoading = useDelayedLoading({waitFor: 600, loading})

  if (!syncStatus) return

  return (
    <div className="absolute bottom-1 left-0 right-0 my-2 text-sm">
      {!isLoading ? (
        <p
          className={clsx("text-zinc-400 text-center", {
            "text-red-600": !syncStatus.success,
          })}
        >
          Last synced {timeAgo(syncStatus.lastSyncedAt)}
        </p>
      ) : (
        <Spinner />
      )}
    </div>
  )
}
