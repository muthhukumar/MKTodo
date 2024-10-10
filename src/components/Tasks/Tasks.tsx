import * as React from "react"

import {TTask, TaskTypes} from "~/@types"
import Task from "./Task"
import clsx from "clsx"
import {useRouter} from "@tanstack/react-router"
import {API} from "~/service"
import {createTask, separateTasks} from "~/utils/tasks"
import CreateTaskInput from "./CreateTaskInput"
import {Loader} from ".."
import {useAudioPlayer, useDeviceCallback, useOnKeyPress} from "~/utils/hooks"
import doneAudio from "~/assets/audio/ting.mp3"
import {handleError} from "~/utils/error"
import {options} from "../Select/data"
import {getMetaTags, removeDuplicates} from "./Drawer"
import {CompletedTasks, Header} from "."

interface TasksProps {
  showFilters?: boolean
  title?: string
  tasks: Array<TTask>
  type: TaskTypes
  source?: "online" | "offline"
  showHeader?: boolean
  showTaskCreate?: boolean
}

const extractTagsFromTasks = (tasks: Array<TTask>) => {
  return removeDuplicates(tasks.map(t => getMetaTags(t.metadata)).flat(), options)
}

export default function Tasks(props: TasksProps) {
  const {showFilters, title, source, showHeader = true, showTaskCreate = true} = props
  const [tasks, setTasks] = React.useState(props.tasks)

  const [newTasks, setNewTasks] = React.useState<
    Array<{name: string; status: "started" | "failed" | "retrying"}>
  >([])
  const [taskType, setTaskType] = React.useState(props.type)
  const [tagFilters, setTagFilters] = React.useState<Array<string>>([])

  const router = useRouter()

  const inputRef = React.useRef<HTMLInputElement>(null)

  const {togglePlay} = useAudioPlayer(doneAudio)

  const onPress = useDeviceCallback<KeyboardEvent>({
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

  const onTaskToggle = React.useCallback((id: number, completed: boolean) => {
    if (!completed) togglePlay()

    if (!completed) {
      setTimeout(() => {
        setTasks(tasks => tasks.filter(t => t.id !== id))
      }, 2000)
    }
  }, [])

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
      handleError({error, defaultMessage: "Retrying Create Task failed."})

      setNewTasks(state => {
        const clone = [...state]

        const idx = clone.findIndex(t => t.name === task)

        clone[idx] = {...clone[idx], status: "failed"}

        return clone
      })
    }
  }

  const {completedTasks, pendingTasks} = React.useMemo(() => {
    if (tagFilters.length > 0) {
      return separateTasks(
        tasks.filter(t => {
          if (!t.metadata) return false

          return tagFilters.some(option => t.metadata.includes(option))
        }),
      )
    }

    return separateTasks(tasks)
  }, [tasks, tagFilters])

  const tagFilterOptions = React.useMemo(() => extractTagsFromTasks(tasks), [tasks])

  return (
    <div className="bg-background w-full">
      <div className="w-full relative">
        <div className="px-3">
          {showHeader && (
            <Header
              taskType={props.type as Exclude<TaskTypes, "planned:tomorrow" | "planned:today">}
              showFilters={showFilters}
              tagFilters={tagFilters}
              setTagFilters={setTagFilters}
              tasks={tasks}
              pendingTasks={pendingTasks}
              tagFilterOptions={tagFilterOptions}
              title={title || "Tasks"}
              source={source}
            />
          )}
          <div className={clsx("min-h-screen my-1 flex flex-col gap-[2px]")}>
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
            <CompletedTasks tasks={completedTasks} onTaskToggle={onTaskToggle} type={props.type} />
          </div>

          <div className="min-h-[20vh]" />
          {showTaskCreate && (
            <CreateTaskInput
              tagFilterOptions={tagFilterOptions}
              taskType={props.type}
              setTaskType={setTaskType}
              setNewTasks={setNewTasks}
            />
          )}
        </div>
      </div>
    </div>
  )
}
