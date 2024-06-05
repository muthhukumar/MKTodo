import clsx from "clsx"
import {useTasks} from "../context"
import {timeAgo} from "../utils/date"
import {MdOutlineWbSunny} from "react-icons/md"
import {CiStar} from "react-icons/ci"
import {IconType} from "react-icons"
import {TbHomeCheck} from "react-icons/tb"
import {useReRenderOnPopState} from "../utils/hooks"
import {CiCalendarDate} from "react-icons/ci"

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
        "relative hover:cursor-pointer flex items-center hover:bg-zinc-800 px-2 py-2 rounded-md",
        {
          "bg-zinc-800": isActivePath,
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
  const {query, setQuery} = useTasks()

  return (
    <div className="h-screen relative w-1/4 max-w-md py-8">
      <div className="px-3">
        <div className="flex items-center gap-3">
          <input
            className="text-sm rounded-md py-1 px-2 w-full border border-zinc-700"
            placeholder="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button
            className="px-2 py-[2px] border-zinc-700 border rounded-full text-xs"
            onClick={() => setQuery("")}
          >
            clear
          </button>
        </div>
        <div className="flex-col flex gap-2 mt-5">
          <IconLink Icon={MdOutlineWbSunny} title="My Day" path="/my-day" />
          <IconLink Icon={CiStar} title="Important" path="/important" />
          <IconLink Icon={CiCalendarDate} title="Planned" path="/planned" />
          <IconLink Icon={TbHomeCheck} title="Tasks" path="/" />
        </div>

        <LastSynced />
      </div>
    </div>
  )
}

function LastSynced() {
  const {syncStatus} = useTasks()

  if (!syncStatus) return

  return (
    <div className="absolute bottom-1 left-0 right-0 my-2 text-sm">
      <p
        className={clsx("text-zinc-400 text-center", {
          "text-red-600": !syncStatus.success,
        })}
      >
        Last synced {timeAgo(syncStatus.lastSyncedAt)}
      </p>
    </div>
  )
}
