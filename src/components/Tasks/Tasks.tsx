import * as React from "react"

import {TTask, TaskTypes} from "~/@types"
import Task from "./Task"
import clsx from "clsx"
import {Link, useRouter, useSearch} from "@tanstack/react-router"
import {API} from "~/service"
import {createTask, separateTasks} from "~/utils/tasks"
import MobileOnly from "../MobileOnly"
import toast from "react-hot-toast"
import CreateTaskInput from "./CreateTaskInput"
import SearchBar from "../SearchBar"
import DesktopOnly from "../DesktopOnly"
import MobileCreateTaskInput from "./MobileCreateTaskInput"
import {Loader, MobileSearchBar, Options} from ".."
import {useAudioPlayer, useDeviceCallback, useOnKeyPress} from "~/utils/hooks"
import doneAudio from "~/assets/audio/ting.mp3"
import {handleError2} from "~/utils/error"

interface TasksProps {
  showFilters?: boolean
  title?: string
  tasks: Array<TTask>
  type: TaskTypes
}

export default function Tasks(props: TasksProps) {
  const {showFilters, title} = props
  const [tasks, setTasks] = React.useState(props.tasks)

  const [newTasks, setNewTasks] = React.useState<
    Array<{name: string; status: "started" | "failed" | "retrying"}>
  >([])
  const [taskType, setTaskType] = React.useState(props.type)

  const [task, setTask] = React.useState("")

  const router = useRouter()

  const inputRef = React.useRef<HTMLInputElement>(null)

  const {togglePlay} = useAudioPlayer(doneAudio)

  const onPress = useDeviceCallback({
    mobile: () => undefined,
    desktop: () => inputRef.current?.focus(),
  })

  useOnKeyPress({
    validateKey: e => Boolean((e.metaKey || e.ctrlKey) && e.key === "n"),
    callback: onPress,
  })

  React.useEffect(() => {
    setTasks(props.tasks)
  }, [props.tasks])

  function onTaskToggle(id: number, completed: boolean) {
    if (!completed) togglePlay()

    setTasks(tasks => tasks.filter(t => t.id !== id))
  }

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
      // TODO: refactor this later
      handleError2({error, defaultMessage: "Creating Task failed."})

      setNewTasks(state => {
        const clone = [...state]

        const idx = clone.findIndex(t => t.name === currentTask)

        clone[idx] = {...clone[idx], status: "failed"}

        return clone
      })
    }
  }

  const divRef = React.useRef<HTMLDivElement>(null)

  const {completedTasks, pendingTasks} = React.useMemo(() => separateTasks(tasks), [tasks])

  return (
    <div className="bg-background w-full">
      <div className="w-full relative">
        <div className="px-3">
          <div className="sticky top-0 py-1 left-0 right-0 bg-background">
            <div className="flex items-center justify-between py-2">
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                <span>{title ? title : "Tasks"}</span>
                <span className="font-normal text-xs px-2 py-1 rounded-md bg-hover-background">
                  {pendingTasks.length} / {tasks.length}
                </span>
              </h1>
              <div className="flex items-center gap-3">
                <MobileOnly>
                  <MobileSearchBar />
                </MobileOnly>
                <Options />
              </div>
            </div>

            <DesktopOnly>
              <div className="hidden my-1">
                <SearchBar />
              </div>
            </DesktopOnly>
            {showFilters && <DueDateFilters />}
          </div>

          <div className={clsx("min-h-screen my-1 flex flex-col gap-[2px]")} ref={divRef}>
            {newTasks.map(t => (
              <div
                className="px-3 py-2 bg-item-background rounded-md flex items-center justify-between"
                key={t.name}
              >
                <p>{t.name}</p>
                <div className="flex items-center gap-1">
                  {t.status === "started" && <Loader />}
                  {t.status === "failed" && (
                    <p className="px-2 rounded-md bg-red-700 text-white">failed</p>
                  )}
                  {(t.status === "failed" || t.status === "retrying") && (
                    <button
                      className="px-2 rounded-md bg-red-400"
                      onClick={() => retry(t.name)}
                      disabled={t.status === "retrying"}
                    >
                      {t.status === "retrying" ? (
                        <div className="flex items-center gap-1">
                          <span>Retrying</span>
                          <Loader />
                        </div>
                      ) : (
                        "retry"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {newTasks.length > 0 && <div className="min-h-[12px]" />}
            {pendingTasks.map(t => (
              <Task
                onToggle={onTaskToggle}
                {...t}
                key={t.id}
                type={props.type as "all" | "my-day" | "important" | "planned"}
              />
            ))}
            {completedTasks.length > 0 && (
              <h2 className="w-fit text-sm bg-hover-background rounded-md px-2 py-1 my-2">
                Completed
                <span className="font-normal text-xs px-2 py-1 rounded-md">
                  {completedTasks.length}
                </span>
              </h2>
            )}
            {completedTasks.map(t => (
              <Task
                onToggle={onTaskToggle}
                {...t}
                key={t.id}
                type={props.type as "all" | "my-day" | "important" | "planned"}
              />
            ))}
          </div>

          <div className="min-h-[20vh]" />
          <DesktopOnly>
            <div className="p-3 bg-background sticky w-full bottom-4 md:bottom-0 left-0 right-0">
              <CreateTaskInput
                ref={inputRef}
                taskType={taskType}
                setTaskType={setTaskType}
                task={task}
                setTask={value => setTask(value)}
                onSubmit={onSubmit}
              />
            </div>
          </DesktopOnly>

          <MobileOnly>
            <MobileCreateTaskInput
              taskType={taskType}
              setTaskType={setTaskType}
              task={task}
              setTask={value => setTask(value)}
              onSubmit={onSubmit}
            />
          </MobileOnly>
        </div>
      </div>
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
