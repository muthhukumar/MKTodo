import * as React from "react"

import {TTask, TaskTypes} from "~/@types"
import Task from "./Task"
import clsx from "clsx"
import Drawer from "./Drawer"
import {Link, useRouter, useSearch} from "@tanstack/react-router"
import {API} from "~/service"
import {createTask, separateTasks} from "~/utils/tasks"
import {PiHamburger} from "react-icons/pi"
import MobileOnly from "../MobileOnly"
import toast from "react-hot-toast"
import CreateTaskInput from "./CreateTaskInput"
import SearchBar from "../SearchBar"

interface TasksProps {
  showFilters?: boolean
  title?: string
  tasks: Array<TTask>
  type: TaskTypes
}

export default function Tasks(props: TasksProps) {
  const {showFilters, title} = props

  const [newTasks, setNewTasks] = React.useState<
    Array<{name: string; status: "started" | "failed" | "retrying"}>
  >([])
  const [taskType, setTaskType] = React.useState<TaskTypes>(props.type)

  const [task, setTask] = React.useState("")

  const router = useRouter()

  const tasks = props.tasks

  const [showSidebar, setShowSidebar] = React.useState<{show: boolean; taskId: TTask["id"] | null}>(
    {
      show: false,
      taskId: null,
    },
  )

  async function retry(task: string) {
    setNewTasks(state => {
      const clone = [...state]

      const idx = clone.findIndex(t => t.name === task)

      clone[idx] = {...clone[idx], status: "retrying"}

      return clone
    })

    try {
      await API.createTask(createTask(taskType, task))

      setNewTasks(state => state.filter(t => t.name !== task))

      router.invalidate()
    } catch (error) {
      setNewTasks(state => {
        const clone = [...state]

        const idx = clone.findIndex(t => t.name === task)

        clone[idx] = {...clone[idx], status: "failed"}

        return clone
      })
      toast.error("Retrying Create Task failed.")
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!task) return

    let currentTask = task

    setTask("")

    setNewTasks(state => [...state, {name: currentTask, status: "started"}])

    try {
      await API.createTask(createTask(taskType, currentTask))

      setNewTasks(state => state.filter(t => t.name !== currentTask))

      router.invalidate()
    } catch (error) {
      setNewTasks(state => {
        const clone = [...state]

        const idx = clone.findIndex(t => t.name === currentTask)

        clone[idx] = {...clone[idx], status: "failed"}

        return clone
      })
      toast.error("Create Task failed.")
    }
  }

  const selectedTask = showSidebar.taskId ? tasks.find(t => t.id === showSidebar.taskId) : null

  const divRef = React.useRef<HTMLDivElement>(null)

  const {completedTasks, pendingTasks} = React.useMemo(() => separateTasks(tasks), [tasks])

  return (
    <div className="flex bg-dark-black w-full">
      <div className="w-full max-h-[100vh] relative">
        <div className="px-3">
          <div className="flex items-center mt-3 mb-2 justify-between">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <span>{title ? title : "Tasks"}</span>
              <span className="font-normal text-xs px-2 py-1 rounded-md bg-light-black">
                {pendingTasks.length} / {tasks.length}
              </span>
            </h1>
            <MobileOnly>
              <Link to="/mobile-nav">
                <PiHamburger size={20} />
              </Link>
            </MobileOnly>
          </div>

          <div className="md:hidden my-2">
            <SearchBar />
          </div>
          {showFilters && <DueDateFilters />}
          <div
            className={clsx(
              "my-2 flex flex-col gap-[2px] no-scrollbar scroll-smooth overflow-y-scroll",
              {
                "md:h-[85vh] h-[80vh]": showFilters,
                "md:h-[90vh] h-[87vh]": !showFilters,
              },
            )}
            ref={divRef}
          >
            {newTasks.map(t => (
              <div
                className="px-3 py-1 bg-light-black rounded-md flex items-center justify-between"
                key={t.name}
              >
                <p>{t.name}</p>
                <div className="flex items-center gap-1">
                  {t.status === "started" && <p className="ml-auto">Creating...</p>}
                  {t.status === "failed" && (
                    <p className="px-2 rounded-md bg-red-700 text-white">failed</p>
                  )}
                  {(t.status === "failed" || t.status === "retrying") && (
                    <button
                      className="px-2 rounded-md bg-red-400"
                      onClick={() => retry(t.name)}
                      disabled={t.status === "retrying"}
                    >
                      {t.status === "retrying" ? "retrying..." : "retry"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {newTasks.length > 0 && <div className="min-h-[12px]" />}
            {pendingTasks.map(t => (
              <Task
                {...t}
                key={t.id}
                type={props.type as "all" | "my-day" | "important" | "planned"}
              />
            ))}
            {completedTasks.length > 0 && (
              <h2 className="w-fit text-sm bg-light-black rounded-md px-2 py-1 my-2">
                Completed
                <span className="font-normal text-xs px-2 py-1 rounded-md bg-light-black">
                  {completedTasks.length}
                </span>
              </h2>
            )}
            {completedTasks.map(t => (
              <Task
                {...t}
                key={t.id}
                type={props.type as "all" | "my-day" | "important" | "planned"}
              />
            ))}
            <div className="min-h-[8vh]" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-dark-black">
            <CreateTaskInput
              taskType={taskType}
              setTaskType={setTaskType}
              task={task}
              setTask={value => setTask(value)}
              onSubmit={onSubmit}
            />
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
            "inline-block w-fit hover:bg-light-black rounded-md px-3 py-2 text-sm no-break",
            {
              "bg-light-black": filter === f.filter,
            },
          )}
        >
          <span>{f.name}</span>
        </Link>
      ))}
    </div>
  )
}
