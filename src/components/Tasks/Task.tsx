import React from "react"
import {TTask} from "~/@types"
import {API} from "~/service"

import {FaCircleCheck} from "react-icons/fa6"
import {FaRegStar} from "react-icons/fa"
import {FaStar} from "react-icons/fa"
import {FaRegCircle} from "react-icons/fa6"
import {twMerge} from "tailwind-merge"
import {Link, useRouter, useSearch} from "@tanstack/react-router"
import {MdSunny} from "react-icons/md"
import {isDateSameAsToday} from "~/utils/date"
import Loader from "../Loader"

interface TaskProps extends TTask {
  type: "all" | "my-day" | "planned" | "important"
}

export default function Task(props: TaskProps) {
  const [toggling, setToggling] = React.useState(false)

  const router = useRouter()

  const search = useSearch({from: `/_auth/tasks/${props.type}`})

  async function toggleTaskImportance(id: number) {
    try {
      await API.toggleTaskImportanceById(id)

      router.invalidate()
    } catch (error) {
      console.log("failed to toggle task importance")
    }
  }

  async function toggleTask(id: number) {
    setToggling(true)

    try {
      await API.toggleTaskCompletedById(id)

      router.invalidate()
    } catch (error) {
      console.log("failed to toggle task")
    } finally {
      setToggling(false)
    }
  }

  const tasksType = props.type || "all"

  const to = `/tasks/${tasksType}/$taskId` as const

  return (
    <div className="flex items-center w-full rounded-md bg-light-black px-4">
      {toggling ? (
        <div className="w-[24px]">
          <Loader />
        </div>
      ) : (
        <TaskToggleIcon
          completed={props.completed}
          onClick={e => {
            toggleTask(props.id)

            e.stopPropagation()
          }}
        />
      )}
      <Link
        to={to}
        params={{taskId: String(props.id)}}
        search={{
          query: search.query,
          // @ts-ignore
          // TODO - fix this later
          filter: search.filter,
        }}
        key={props.id}
        preload="intent"
        preloadDelay={800}
        className={twMerge("py-2 w-full flex items-center text-white")}
      >
        <div className="px-2">
          <div>
            <p key={props.id} className="text-white m-0 text-sm font-medium break-all">
              {props.name}
            </p>
            {isDateSameAsToday(props.marked_today) && (
              <div className="text-xs flex items-center gap-2 text-gray-400">
                <MdSunny size={10} />
                <p>My Day</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center ml-auto w-[24px]">
          <button
            onClick={e => {
              toggleTaskImportance(props.id)

              e.stopPropagation()
            }}
          >
            {!props.is_important ? (
              <FaRegStar size={18} className="text-zinc-500" />
            ) : (
              <FaStar size={18} className="text-zinc-500" />
            )}
          </button>
        </div>
      </Link>
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
