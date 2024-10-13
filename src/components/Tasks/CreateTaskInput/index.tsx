import * as React from "react"
import {DesktopOnly, MobileOnly} from "~/components"
import MobileCreateTaskInput from "./Mobile"
import Desktop from "./Desktop"
import {useRouter} from "@tanstack/react-router"
import {handleError} from "~/utils/error"
import {logger} from "~/utils/logger"
import {createTask} from "~/utils/tasks"
import {taskQueue} from "~/utils/task-queue"
import {API} from "~/service"
import {TaskTypes} from "~/@types"
import {useAutoCompletion, useDeviceCallback} from "~/utils/hooks"
import {options} from "~/components/Select/data"

interface CreateTaskInputProps {
  metadata: Array<string>
  setNewTasks: React.Dispatch<
    React.SetStateAction<
      {
        name: string
        status: "started" | "failed" | "retrying"
      }[]
    >
  >
  taskType: TaskTypes
  // TODO: refactor this dispatch
  setTaskType: React.Dispatch<
    React.SetStateAction<
      "all" | "my-day" | "important" | "planned" | "planned:today" | "planned:tomorrow"
    >
  >
  tagFilterOptions: any[]
}

function CreateTaskInput(props: CreateTaskInputProps) {
  const {setNewTasks, setTaskType, taskType, tagFilterOptions, metadata} = props

  const [task, setTask] = React.useState("")

  const router = useRouter()

  const inputRef = React.useRef<HTMLInputElement>(null)
  const mobileInputRef = React.useRef<HTMLInputElement>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!task) return

    let currentTask = task

    setTask("")

    setNewTasks(state => [...state, {name: currentTask, status: "started"}])

    try {
      await taskQueue.enqueue(API.createTask.bind(null, createTask(taskType, currentTask)))

      setNewTasks(state => state.filter(t => t.name !== currentTask))

      router.invalidate()
    } catch (error) {
      logger.error("Create Task: ", JSON.stringify(error))

      handleError({error, defaultMessage: "Creating Task failed."})

      setNewTasks(state => {
        const clone = [...state]

        const idx = clone.findIndex(t => t.name === currentTask)

        clone[idx] = {...clone[idx], status: "failed"}

        return clone
      })
    }
  }

  const focus = useDeviceCallback({
    mobile: () => mobileInputRef.current?.focus(),
    desktop: () => inputRef.current?.focus(),
  })

  const autoCompletionProps = useAutoCompletion({
    metadata,
    task,
    onChange: word => {
      setTask(word)
      focus()
    },
    defaultHash: {
      "!": [...options.map(o => `!${o}`)],
    },
  })

  return (
    <>
      <DesktopOnly>
        <div className="p-3 bg-background sticky w-full bottom-4 md:bottom-0 left-0 right-0">
          <Desktop
            {...autoCompletionProps}
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
          ref={mobileInputRef}
          {...autoCompletionProps}
          tags={tagFilterOptions}
          taskType={taskType}
          setTaskType={setTaskType}
          task={task}
          setTask={value => setTask(value)}
          onSubmit={onSubmit}
        />
      </MobileOnly>
    </>
  )
}

export default CreateTaskInput
