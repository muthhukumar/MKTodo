import React from "react"
import {TTask} from "~/@types"
import {API} from "~/service"
import {useOutsideAlerter} from "~/utils/hooks"

import {FaCircleCheck} from "react-icons/fa6"
import {FaRegStar} from "react-icons/fa"
import {FaStar} from "react-icons/fa"
import {FaRegCircle} from "react-icons/fa6"
import {twMerge} from "tailwind-merge"
import clsx from "clsx"
import {useRouter} from "@tanstack/react-router"

interface TaskProps extends TTask {
  onClick: (task: TTask) => void
}

export default function Task(props: TaskProps) {
  const [showInput, setShowInput] = React.useState(false)
  const [task, setTask] = React.useState(props.name)
  const [highlight, setHighlight] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const divRef = React.useRef<HTMLDivElement>(null)

  const router = useRouter()

  useOutsideAlerter(inputRef, {onClickOutside: () => setShowInput(false), ignore: []})
  useOutsideAlerter(divRef, {onClickOutside: () => setHighlight(false), ignore: []})

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      await API.updateTaskById({id: props.id, task})

      router.invalidate()
    } catch {
      setTask(props.name)

      console.log("failed to update task name")
    } finally {
      setShowInput(false)
    }
  }

  async function toggleTaskImportance(id: number) {
    try {
      await API.toggleTaskImportanceById(id)

      router.invalidate()
    } catch (error) {
      console.log("failed to toggle task importance")
    }
  }

  async function toggleTask(id: number) {
    try {
      await API.toggleTaskCompletedById(id)

      router.invalidate()
    } catch (error) {
      console.log("failed to toggle task")
    }
  }

  return (
    <div
      ref={divRef}
      key={props.id}
      className={twMerge(
        "flex items-center text-white rounded-md bg-light-black px-4 py-2",
        clsx({
          "bg-zinc-700": highlight,
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
      <div className="flex-1 px-2">
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
      </div>
      <div className="flex items-center ml-auto w-[24px]">
        <button
          onClick={e => {
            toggleTaskImportance(props.id)

            e.stopPropagation()
          }}
        >
          {!props.is_important ? (
            <FaRegStar size={20} className="text-zinc-700" />
          ) : (
            <FaStar size={20} className="text-zinc-400" />
          )}
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
    <button onClick={onClick} className="w-[24px]">
      {!completed ? (
        <FaRegCircle size={18} className="text-zinc-400 mr-5" />
      ) : (
        <FaCircleCheck size={18} className="text-zinc-400 mr-5" />
      )}
    </button>
  )
}
