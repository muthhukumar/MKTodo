import * as React from "react"

import {FaPlus} from "react-icons/fa6"
import {TaskTypes} from "~/@types"
import {useOutsideAlerter} from "~/utils/hooks"
import {BsFillFileArrowUpFill} from "react-icons/bs"
import {FeatureFlag} from "~/components"

interface CreateTaskInputProps {
  task: string
  setTask: (value: string) => void
  setTaskType: (value: TaskTypes) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  taskType: TaskTypes
  // TODO: Implement this or remove this dependency
  tags: Array<string>
}

export default function MobileCreateTaskInput(props: CreateTaskInputProps) {
  const [showInput, setShowInput] = React.useState(false)

  const {taskType, task, setTask: onChange, onSubmit, setTaskType} = props

  const formRef = React.useRef<HTMLFormElement>(null)

  function hideInput() {
    setShowInput(false)
  }

  const inputRef = React.useRef<HTMLInputElement>(null)

  useOutsideAlerter(formRef, {onClickOutside: hideInput})

  return (
    <>
      <div className="fixed bottom-20 right-3">
        {!showInput && (
          <button
            onClick={() => setShowInput(true)}
            className="p-3 rounded-full bg-tblue border border-border"
          >
            <FaPlus className="text-white" />
          </button>
        )}
      </div>
      {showInput && (
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="bg-item-background border border-zinc-600 fixed bottom-0 left-0 right-0 w-[98%] mx-auto rounded-t-md z-50"
        >
          <div className="w-full flex items-center">
            <input
              ref={inputRef}
              value={task}
              type="text"
              name="Task"
              autoFocus
              title="Task"
              onChange={e => onChange(e.target.value)}
              className="outline-none w-full text-white rounded-md px-2 py-3 bg-item-background"
              placeholder="Add a Task"
            />
            <button
              type="submit"
              className="mr-3 flex items-center justify-center"
              onClick={() => {
                inputRef.current?.focus()
              }}
            >
              <BsFillFileArrowUpFill size={30} className="ext-inherit text-white" />
            </button>
          </div>
          <div className="w-full h-[1px] bg-border my-1" />
          <div className="bg-item-background flex items-center p-1">
            <FeatureFlag feature="TaskTypeInputInCreateTask">
              <FeatureFlag.Feature>
                <div className="rounded-md border-border border inline-block py-1 text-white">
                  <select
                    className="reset-select px-1"
                    value={taskType}
                    onChange={e => setTaskType(e.target.value as TaskTypes)}
                  >
                    <option value="all">Default</option>
                    <option value="my-day">My Day</option>
                    <option value="important">Important</option>
                    <option value="planned:today">Today</option>
                    <option value="planned:tomorrow">Tomorrow</option>
                  </select>
                </div>
              </FeatureFlag.Feature>
            </FeatureFlag>
            <button
              type="button"
              className="ml-auto border px-3 py-1 border-border rounded-md"
              onClick={hideInput}
            >
              Close
            </button>
          </div>
        </form>
      )}
    </>
  )
}
