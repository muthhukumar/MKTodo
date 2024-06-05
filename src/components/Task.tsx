import React from "react"
import {TTask} from "../@types"
import {API} from "../service"
import {useOutsideAlerter} from "../utils/hooks"

import {FaRegStar} from "react-icons/fa"
import {FaStar} from "react-icons/fa"
import {FaRegCircle} from "react-icons/fa6"
import {FaRegCircleCheck} from "react-icons/fa6"
import {twMerge} from "tailwind-merge"
import clsx from "clsx"
import {useTasks} from "../context"
import {MdSunny} from "react-icons/md"
import {isDateSameAsToday} from "../utils/date"

interface TaskProps extends TTask {
  onClick: (task: TTask) => void
  onToggleImportance: (id: number) => void
  onToggleAddToMyDay: (id: number) => void
}

export default function Task(props: TaskProps) {
  const [showInput, setShowInput] = React.useState(false)
  const [task, setTask] = React.useState(props.name)
  const [highlight, setHighlight] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const divRef = React.useRef<HTMLDivElement>(null)

  useOutsideAlerter(inputRef, {onClickOutside: () => setShowInput(false), ignore: []})
  useOutsideAlerter(divRef, {onClickOutside: () => setHighlight(false), ignore: []})

  const {sync, toggleTaskCompleted: toggleTask} = useTasks()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      await API.updateTaskById({id: props.id, task})

      setTimeout(sync, 1000)
    } catch {
      setTask(props.name)

      console.log("failed to update task name")
    } finally {
      setShowInput(false)
    }
  }

  return (
    <div
      ref={divRef}
      key={props.id}
      className={twMerge(
        "flex items-center text-white rounded-md bg-zinc-900 px-4 py-2",
        clsx({
          "bg-zinc-800": highlight,
        }),
      )}
      onClick={() => {
        props.onClick(props)
        setHighlight(true)
      }}
    >
      <TaskToggleIcon
        completed={props.completed}
        onClick={e => {
          toggleTask(props.id)

          e.stopPropagation()
        }}
      />
      {!showInput ? (
        <p
          key={props.id}
          className="text-white"
          onClick={() => {
            setShowInput(state => !state)
          }}
        >
          {task}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mr-1">
          <input
            ref={inputRef}
            className="bg-zinc-900"
            value={task}
            onChange={e => setTask(e.target.value)}
          />
        </form>
      )}
      <div className="flex items-center gap-3 w-fit ml-auto">
        <button
          className={clsx(
            "border-zinc-400 border rounded-full px-3 flex items-center gap-1 text-xs py-1",
          )}
          onClick={e => {
            props.onToggleAddToMyDay(props.id)

            e.stopPropagation()
          }}
        >
          <MdSunny size={12} />
          <span>{isDateSameAsToday(props.marked_today) ? "Added to my day" : "Add to my day"}</span>
        </button>
        <button
          onClick={e => {
            props.onToggleImportance(props.id)

            e.stopPropagation()
          }}
        >
          {!props.is_important ? <FaRegStar size={20} /> : <FaStar size={20} />}
        </button>
      </div>
    </div>
  )
}

export function TaskToggleIcon({
  completed,
  onClick,
}: {
  completed: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}) {
  return (
    <button onClick={onClick}>
      {!completed ? (
        <FaRegCircle size={18} className="text-zinc-400 mr-5" />
      ) : (
        <FaRegCircleCheck size={18} className="text-zinc-400 mr-5" />
      )}
    </button>
  )
}
