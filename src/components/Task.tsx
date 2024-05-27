import React from "react"
import {TTask} from "../@types"
import {API} from "../service"
import {useOutsideAlerter} from "../utils/hooks"

interface TaskProps extends TTask {
  onDelete: (id: number) => void
  onUpdate: () => void
}

export default function Task(props: TaskProps) {
  const [showInput, setShowInput] = React.useState(false)
  const [task, setTask] = React.useState(props.name)

  const inputRef = React.useRef<HTMLInputElement>(null)

  useOutsideAlerter(inputRef, {onClickOutside: () => setShowInput(false)})

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      await API.updateTaskId({id: props.id, task})

      setTimeout(props.onUpdate, 1000)
    } catch {
      setTask(props.name)

      console.log("failed to update task name")
    } finally {
      setShowInput(false)
    }
  }

  return (
    <div key={props.id} className="flex items-center text-white">
      {!showInput ? (
        <p
          key={props.id}
          className="w-full text-white"
          onClick={() => setShowInput(state => !state)}
        >
          {task}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="w-full mr-1">
          <input
            ref={inputRef}
            className="w-full border"
            value={task}
            onChange={e => setTask(e.target.value)}
          />
        </form>
      )}
      <button
        className="ml-auto border rounded-md px-3"
        type="button"
        onClick={() => props.onDelete(props.id)}
      >
        Delete
      </button>
    </div>
  )
}
