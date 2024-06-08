import * as React from "react"

import {DueDateFilters as DueDateFiltersType, TTask} from "~/@types"
import Task from "./Task"
import {useTasks} from "~/context"
import clsx from "clsx"
import {FaPlus} from "react-icons/fa6"
import Drawer from "./Drawer"

interface TasksProps {
  showFilters?: boolean
  title?: string
}

export default function Tasks(props: TasksProps) {
  const {showFilters, title} = props

  const [task, setTask] = React.useState("")
  const {
    tasks,
    createTask,
    toggleTaskImportance,
    toggleTaskAddToMyDay,
    dueDateFilter,
    setDueDateFilter,
  } = useTasks()

  const [showSidebar, setShowSidebar] = React.useState<{show: boolean; taskId: TTask["id"] | null}>(
    {
      show: false,
      taskId: null,
    },
  )

  React.useEffect(() => {
    props.showFilters && setDueDateFilter("all-planned")
  }, [props.showFilters])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!task) return

    createTask(task, () => {
      setTask("")
    })
  }

  const selectedTask = tasks.find(t => t.id === showSidebar.taskId)

  const divRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="flex bg-dark-black w-full">
      <div className="w-full max-h-[100vh] relative">
        <div className="px-3">
          <div className="flex items-center mt-5 mb-1">
            <h1 className="text-2xl font-bold">{title ? title : "Tasks"}</h1>
          </div>
          {showFilters && (
            <div>
              <DueDateFilters dueDateFilter={dueDateFilter} onFilter={setDueDateFilter} />
            </div>
          )}
          <div
            className="mt-4 flex flex-col gap-[2px] custom-scrollbar scroll-smooth overflow-y-scroll h-[90vh]"
            ref={divRef}
          >
            {tasks.map(t => (
              <Task
                key={t.id}
                {...t}
                onToggleAddToMyDay={toggleTaskAddToMyDay}
                onToggleImportance={toggleTaskImportance}
                onClick={currentTask => setShowSidebar({taskId: currentTask.id, show: true})}
              />
            ))}
            <div className="min-h-[8vh]" />
          </div>
          <div className={clsx("absolute bottom-0 left-0 right-0 p-3 bg-dark-black")}>
            <form
              onSubmit={onSubmit}
              className="focus-within:ring-2 focus-within:ring-blue-500 rounded-md flex items-center w-full bg-mid-gray"
            >
              <FaPlus className="mx-3" />
              <input
                value={task}
                onChange={e => setTask(e.target.value)}
                className="outline-none w-full text-white rounded-md px-2 py-3 bg-mid-gray"
                placeholder="Add a Task"
              />
            </form>
          </div>
        </div>
      </div>
      {showSidebar.show && selectedTask && (
        <Drawer
          {...selectedTask}
          onDismiss={() => setShowSidebar({taskId: null, show: false})}
          ignoreRef={divRef}
        />
      )}
    </div>
  )
}

const filters = [
  {id: 1, filter: "all-planned", name: "All Planned"},
  {id: 2, filter: "overdue", name: "Overdue"},
  {id: 3, filter: "today", name: "Today"},
  {id: 4, filter: "tomorrow", name: "Tomorrow"},
  {id: 5, filter: "this-week", name: "This Week"},
  {id: 6, filter: "later", name: "Later"},
] as const

interface DueDateFiltersProps {
  onFilter: (filter: DueDateFiltersType) => void
  dueDateFilter: DueDateFiltersType | null
}

function DueDateFilters(props: DueDateFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      {filters.map(f => (
        <button
          key={f.id}
          onClick={() => props.onFilter(f.filter)}
          className={clsx("hover:bg-light-black rounded-md px-3 py-[2px] text-sm", {
            "bg-light-black": props.dueDateFilter === f.filter,
          })}
        >
          {f.name}
        </button>
      ))}
    </div>
  )
}
