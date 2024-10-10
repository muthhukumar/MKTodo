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
] as const

function DueDateFilters() {
  const {filter} = useSearch({from: "/_auth/tasks/planned"})

  return (
    <div className="flex items-center gap-2 overflow-auto no-scrollbar">
      {filters.map(f => (
        <Link
          to="/tasks/planned"
          search={{filter: f.filter, query: ""}}
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
