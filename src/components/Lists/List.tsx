import {Link} from "@tanstack/react-router"
import type {List} from "~/@types"
import {timeAgo} from "~/utils/date"
import {Divider} from ".."

interface ListsProps extends List {}

export default function List(props: ListsProps) {
  const {tasks_count, name, created_at, id} = props

  return (
    <Link
      to="/list/$listId/tasks"
      params={{listId: String(id)}}
      className="bg-item-background px-3 py-2 rounded-md"
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold">{name}</p>
      </div>
      <Divider space="sm" />
      <div className="flex items-center gap-3 text-xs mt-1">
        <p>
          <strong>{tasks_count}</strong> tasks
        </p>
        <p>Created {timeAgo(created_at)}</p>
      </div>
    </Link>
  )
}
