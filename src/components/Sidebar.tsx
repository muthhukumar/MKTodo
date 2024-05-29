import clsx from "clsx"
import {useTasks} from "../context"
import {timeAgo} from "../utils/date"
import {MdOutlineWbSunny} from "react-icons/md"
import {CiStar} from "react-icons/ci"
import {IconType} from "react-icons"
import {TbHomeCheck} from "react-icons/tb"

function IconLink({Icon, title}: {Icon: IconType; title: string}) {
  return (
    <div className="flex items-center hover:bg-zinc-800 px-2 py-2 rounded-md">
      <div className="flex-[0.1]">
        <Icon size={20} />
      </div>
      <div className="flex-[0.9]">
        <p className="text-sm">{title}</p>
      </div>
    </div>
  )
}

export default function Sidebar() {
  return (
    <div className="h-screen relative w-1/4 max-w-md py-8">
      <div className="px-3">
        <input className="rounded-md py-1 px-2 w-full" placeholder="Search" />
        <div className="flex-col flex gap-2 mt-5">
          <IconLink Icon={MdOutlineWbSunny} title="My Day" />
          <IconLink Icon={CiStar} title="Important" />
          <IconLink Icon={TbHomeCheck} title="Tasks" />
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
        className={clsx("text-center", {
          "text-red-600": !syncStatus.success,
        })}
      >
        Last synced {timeAgo(syncStatus.lastSyncedAt)}
      </p>
    </div>
  )
}
