import React from "react"
import type {TTask, TaskTypes} from "~/@types"
import {API} from "~/service"

import {FaCircleCheck} from "react-icons/fa6"
import {FaRegStar} from "react-icons/fa"
import {FaStar} from "react-icons/fa"
import {FaRegCircle} from "react-icons/fa6"
import {twMerge} from "tailwind-merge"
import {Link, useParams, useRouter} from "@tanstack/react-router"
import {MdSunny, MdRepeat} from "react-icons/md"
import {isDateInPast, isDateSameAsToday, isTaskMoreThanOneMonthOld} from "~/utils/date"
import {CiCalendar} from "react-icons/ci"
import {getDueDateDisplayStr} from "~/utils/tasks"
import clsx from "clsx"
import {GoDotFill} from "react-icons/go"
import Linkify from "../Linkify"
import {handleError} from "~/utils/error"
import {getMetaTags} from "./Drawer"
import {getTagColor} from "../Select/data"
import FeatureFlag from "../FeatureFlag"
import {taskQueue} from "~/utils/task-queue"
import {useFeatureValue} from "~/feature-context"

interface TaskProps extends TTask {
  type: Exclude<TaskTypes, "planned:tomorrow" | "planned:today"> | "search" | "list"
  onToggle: (id: number, completed: boolean) => void
}

function Task(props: TaskProps) {
  const [localToggle, setLocalToggle] = React.useState(false)

  const router = useRouter()

  const param = useParams({strict: false})

  async function toggleTaskImportance(id: number) {
    try {
      await API.toggleTaskImportanceById(id)

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Toggle Importance failed"})
    }
  }

  async function toggleTask(id: number, completed: boolean) {
    setLocalToggle(!completed)

    props.onToggle(props.id, completed)

    try {
      await taskQueue.enqueue(API.toggleTaskCompletedById.bind(null, id))
    } catch (error) {
      setLocalToggle(false)
      handleError({error, defaultMessage: "Toggle Completion failed"})
    } finally {
      if (!completed) {
        setTimeout(router.invalidate, 5000)
      } else {
        router.invalidate()
      }
    }
  }

  // TODO: refactor this later
  const from =
    props.type === "search"
      ? "/search"
      : props.type === "list"
        ? `/list/${props.list_id}`
        : `/tasks/${props.type || "all"}`

  const to =
    props.type === "search"
      ? "/search/$taskId"
      : props.type === "list"
        ? `/list/${props.list_id}/tasks/${props.id}`
        : (`/tasks/${props.type}/$taskId` as const)

  const metatags = React.useMemo(() => getMetaTags(props.metadata), [props.metadata])

  const preLoadTasks = useFeatureValue("PreLoadTasks")

  return (
    <div
      className={twMerge(
        clsx(
          "bg-item-background overflow-hidden border border-border flex items-center w-full rounded-md px-3 md:px-4 py-[1px] hover:bg-hover-background my-[1px]",
          {
            "bg-hover-background": param.taskId && Number(param.taskId) === props.id,
          },
        ),
      )}
    >
      <TaskToggleIcon
        completed={props.completed || localToggle}
        onClick={e => {
          toggleTask(props.id, props.completed)

          e.stopPropagation()
        }}
      />
      <Link
        to={to}
        params={{taskId: String(props.id)}}
        preload={preLoadTasks?.enable ? "intent" : false}
        preloadDelay={preLoadTasks?.enable ? 1000 : undefined}
        search={{
          from: from,
          query: "",
        }}
        key={props.id}
        className={twMerge("py-2 w-full flex items-center text-white")}
      >
        <div className="w-full px-2">
          <div>
            <p
              key={props.id}
              className="text-white m-0 text-base md:text-sm font-medium break-words text-left"
            >
              <FeatureFlag feature="LinkifyLinkInTask">
                <FeatureFlag.Feature>
                  <Linkify preventNavigation>{props.name}</Linkify>
                </FeatureFlag.Feature>
                <FeatureFlag.Fallback>{props.name}</FeatureFlag.Fallback>
              </FeatureFlag>
            </p>
            <div className="relative flex items-center gap-x-3">
              {isDateSameAsToday(props.marked_today) && (
                <div className="text-xs flex items-center gap-1 text-gray-400">
                  <MdSunny size={10} />
                  <p>My Day</p>
                </div>
              )}
              {Boolean(isDateSameAsToday(props.marked_today) && Boolean(props.due_date)) && (
                <GoDotFill className="text-gray-400" size={6} />
              )}

              {Boolean(props.due_date) && <DueDateTag value={props.due_date} />}
              <FeatureFlag feature="ShowTaskSubTaskInfo">
                <FeatureFlag.Feature>
                  {props.subtask_count > 0 && (
                    <SubTaskInfo
                      totalSubTasks={props.subtask_count}
                      totalCompletedSubTasks={props.subtask_count - props.incomplete_subtask_count}
                    />
                  )}
                </FeatureFlag.Feature>
              </FeatureFlag>
              <FeatureFlag feature="RecurringTaskTag">
                <FeatureFlag.Feature>
                  {props.recurrence_pattern !== "" && (
                    <div className="flex items-center gap-1 text-blue-400 text-xs">
                      <MdRepeat size={10} />
                      <span>Repeat</span>
                    </div>
                  )}
                </FeatureFlag.Feature>
              </FeatureFlag>

              <FeatureFlag feature="TaskTagsView">
                <FeatureFlag.Feature>
                  {metatags.length > 0 && (
                    <div className="ml-auto flex items-center justify-start gap-1">
                      {metatags.map(tag => (
                        <div
                          key={tag}
                          className={clsx("px-1 text-xs border rounded-md", getTagColor(tag))}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                </FeatureFlag.Feature>
              </FeatureFlag>
              <FeatureFlag feature="TaskStaleTag">
                <FeatureFlag.Feature>
                  {!props.completed && isTaskMoreThanOneMonthOld(props.due_date) && (
                    <p className={clsx("px-1 text-xs border rounded-md", getTagColor("stale"))}>
                      stale
                    </p>
                  )}
                </FeatureFlag.Feature>
              </FeatureFlag>
            </div>
          </div>
        </div>
      </Link>
      <FeatureFlag feature="ToggleTaskImportant">
        <FeatureFlag.Feature>
          <div className="flex items-center ml-auto w-[24px]">
            <button
              className="w-full"
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
        </FeatureFlag.Feature>
      </FeatureFlag>
    </div>
  )
}

export function SubTaskInfo({
  totalSubTasks,
  totalCompletedSubTasks,
}: {
  totalSubTasks: number
  totalCompletedSubTasks: number
}) {
  return (
    <p className="text-xs text-gray-300">
      {totalCompletedSubTasks} of {totalSubTasks}
    </p>
  )
}

function DueDateTag({value}: {value: string}) {
  const isToday = isDateSameAsToday(value)
  const overdue = isDateInPast(value)

  const text = getDueDateDisplayStr(value)

  return (
    <div
      className={clsx("text-gray-400 text-xs flex items-center gap-1 rounded-full", {
        "text-blue-300": isToday,
        "text-red-600": overdue,
      })}
    >
      <CiCalendar size={12} />
      <span>{text}</span>
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
    <button onClick={onClick} type="button" className="w-[24px]">
      {!completed ? (
        <FaRegCircle size={18} className="text-zinc-400 mr-5" />
      ) : (
        <FaCircleCheck size={18} className="text-zinc-400 mr-5" />
      )}
    </button>
  )
}

export default React.memo(Task)
