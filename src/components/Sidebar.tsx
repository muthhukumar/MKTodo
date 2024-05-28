import clsx from "clsx"
import {useTasks} from "../context"
import {timeAgo} from "../utils/date"

export default function Sidebar() {
  return (
    <div className="h-screen relative w-1/4 max-w-md">
      <p>My Day</p>
      <p>Tasks</p>
      <LastSynced />
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
