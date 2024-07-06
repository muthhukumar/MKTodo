import * as React from "react"

import {FaPlus} from "react-icons/fa6"
import {TaskTypes} from "~/@types"
import {useOutsideAlerter} from "~/utils/hooks"

interface CreateTaskInputProps {
  task: string
  setTask: (value: string) => void
  setTaskType: (value: TaskTypes) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  taskType: TaskTypes
}

export default function MobileCreateTaskInput(props: CreateTaskInputProps) {
  const [showInput, setShowInput] = React.useState(false)

  const {taskType, task, setTask: onChange, onSubmit, setTaskType} = props

  const formRef = React.useRef<HTMLFormElement>(null)

  function hideInput() {
    setShowInput(false)
  }

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
          className="bg-item-background border border-border fixed bottom-0 left-0 right-0 w-[98%] mx-auto rounded-t-md z-50"
        >
          <input
            value={task}
            type="text"
            name="Task"
            autoFocus
            title="Task"
            onChange={e => onChange(e.target.value)}
            className="outline-none w-full text-white rounded-md px-2 py-3 bg-item-background"
            placeholder="Add a Task"
          />
          <div className="w-full h-[1px] bg-border my-1" />
          <div className="bg-item-background flex items-center p-1">
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
