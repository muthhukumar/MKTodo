import * as React from "react"

import {TTask} from "~/@types"
import Task from "./Task"
import clsx from "clsx"
import {FaPlus} from "react-icons/fa6"
import Drawer from "./Drawer"
import {Link, useRouter, useSearch} from "@tanstack/react-router"
import {API} from "~/service"
import {separateTasks} from "~/utils/tasks"
import {PiHamburger} from "react-icons/pi"
import MobileOnly from "../MobileOnly"

interface TasksProps {
  showFilters?: boolean
  title?: string
  tasks: Array<TTask>
  type: "all" | "my-day" | "planned" | "important"
}

export default function Tasks(props: TasksProps) {
  const {showFilters, title} = props

  const [newTasks, setNewTasks] = React.useState<
    Array<{name: string; status: "started" | "failed" | "retrying"}>
  >([])

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
      await API.createTask({task})

      setNewTasks(state => state.filter(t => t.name !== task))

      router.invalidate()
    } catch (error) {
      setNewTasks(state => {
        const clone = [...state]

        const idx = clone.findIndex(t => t.name === task)

        clone[idx] = {...clone[idx], status: "failed"}

        return clone
      })
      console.log("failed to create task")
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!task) return

    let currentTask = task

    setTask("")

    setNewTasks(state => [...state, {name: currentTask, status: "started"}])

    try {
      await API.createTask({task: currentTask})

      setNewTasks(state => state.filter(t => t.name !== currentTask))

      router.invalidate()
    } catch (error) {
      setNewTasks(state => {
        const clone = [...state]

        const idx = clone.findIndex(t => t.name === currentTask)

        clone[idx] = {...clone[idx], status: "failed"}

        return clone
      })
      console.log("failed to create task")
    }
  }

  const selectedTask = showSidebar.taskId ? tasks.find(t => t.id === showSidebar.taskId) : null

  const divRef = React.useRef<HTMLDivElement>(null)

  const {completedTasks, pendingTasks} = React.useMemo(() => separateTasks(tasks), [tasks])

  return (
    <div className="flex bg-dark-black w-full">
      <div className="w-full max-h-[100vh] relative">
        <div className="px-3">
          <div className="flex items-center mt-5 mb-1 justify-between">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <span>{title ? title : "Tasks"}</span>
              <span className="font-normal text-sm px-2 py-1 rounded-md bg-light-black">
                {completedTasks?.length}
              </span>
            </h1>
            <MobileOnly>
              <Link to="/mobile-nav">
                <PiHamburger size={20} />
              </Link>
            </MobileOnly>
          </div>
          {showFilters && (
            <div className="my-3">
              <DueDateFilters />
            </div>
          )}
          <div
            className="mt-4 flex flex-col gap-[2px] no-scrollbar scroll-smooth overflow-y-scroll h-[90vh]"
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
              <Task {...t} key={t.id} type={props.type} />
            ))}
            {completedTasks.length > 0 && (
              <h2 className="w-fit text-sm bg-light-black rounded-md px-2 py-1 my-2">Completed</h2>
            )}
            {completedTasks.map(t => (
              <Task {...t} key={t.id} type={props.type} />
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
            "inline-block w-fit hover:bg-light-black rounded-md px-5 py-[4px] md:px-3 md:py-[2px] text-sm no-break",
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
