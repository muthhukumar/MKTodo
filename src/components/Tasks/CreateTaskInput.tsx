import {FaPlus} from "react-icons/fa6"
import {TaskTypes} from "~/@types"

interface CreateTaskInputProps {
  task: string
  setTask: (value: string) => void
  setTaskType: (value: TaskTypes) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  taskType: TaskTypes
}

export default function CreateTaskInput({
  taskType,
  task,
  setTask: onChange,
  onSubmit,
  setTaskType,
}: CreateTaskInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="focus-within:ring-2 focus-within:ring-blue-500 rounded-md flex items-center w-full bg-mid-gray"
    >
      <FaPlus className="mx-3" />
      <select
        className="rounded-md py-1 text-white"
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
        value={task}
        type="text"
        name="Task"
        title="Task"
        onChange={e => onChange(e.target.value)}
        className="outline-none w-full text-white rounded-md px-2 py-3 bg-mid-gray"
        placeholder="Add a Task"
      />
    </form>
  )
}
