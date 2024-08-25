import * as React from "react"
import {FaPlus} from "react-icons/fa6"
import {TaskTypes} from "~/@types"

interface CreateTaskInputProps {
  task: string
  setTask: (value: string) => void
  setTaskType: (value: TaskTypes) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  taskType: TaskTypes
}

const CreateTaskInput = React.forwardRef<HTMLInputElement, CreateTaskInputProps>(
  ({taskType, task, setTask: onChange, onSubmit, setTaskType}, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => {
      return {
        focus() {
          inputRef.current?.focus()
        },
      } as HTMLInputElement
    }, [])

    return (
      <form
        onSubmit={onSubmit}
        className="border border-border focus-within:ring-2 focus-within:ring-blue-500 rounded-md flex items-center w-full bg-item-background"
      >
        <FaPlus className="mx-3" />
        <select
          className="reset-select rounded-md py-1 text-white"
          value={taskType}
          onChange={e => setTaskType(e.target.value as TaskTypes)}
        >
          <option value="all">Default</option>
          <option value="my-day">My Day</option>
          <option value="important">Important</option>
          <option value="planned:today">Today</option>
          <option value="planned:tomorrow">Tomorrow</option>
        </select>
        <input
          ref={inputRef}
          value={task}
          type="text"
          name="Task"
          title="Task"
          onChange={e => onChange(e.target.value)}
          className="outline-none w-full text-white rounded-md px-2 py-3 bg-item-background"
          placeholder="Add a Task"
        />
      </form>
    )
  },
)

export default CreateTaskInput
