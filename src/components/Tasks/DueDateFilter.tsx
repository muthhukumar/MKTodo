// TODO: Use proper name for this component
import {Link, useSearch} from "@tanstack/react-router"
import clsx from "clsx"

const filters = [
  {id: 1, filter: "all-planned", name: "All Planned"},
  {id: 2, filter: "overdue", name: "Overdue"},
  {id: 3, filter: "today", name: "Today"},
  {id: 4, filter: "tomorrow", name: "Tomorrow"},
  {id: 5, filter: "this-week", name: "This Week"},
  {id: 6, filter: "later", name: "Later"},
  {id: 6, filter: "recurring", name: "Recurring"},
] as const

function DueDateFilters() {
  const {filter} = useSearch({from: "/_auth/tasks/$taskType"})

  return (
    <div className="flex items-center gap-2 overflow-auto no-scrollbar">
      {filters.map(f => (
        <Link
          to="/tasks/$taskType"
          search={{filter: f.filter}}
          params={{taskType: "planned"}}
          key={f.id}
          className={clsx(
            "inline-block w-fit hover:bg-hover-background rounded-md px-3 py-2 text-sm no-break",
            {
              "bg-hover-background": filter === f.filter,
            },
          )}
        >
          <span>{f.name}</span>
        </Link>
      ))}
    </div>
  )
}

export default DueDateFilters
