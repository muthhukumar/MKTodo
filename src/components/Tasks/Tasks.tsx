import * as React from "react"

import {MdClose, MdOutlineArrowForwardIos, MdOutlineDeleteForever, MdSunny} from "react-icons/md"
import {TTask} from "../../@types"
import {
  areDatesSame,
  formatDueDate,
  getComingMondayDate,
  getDayFromDate,
  getTodayDate,
  getTomorrowDate,
  isDateSameAsToday,
  timeAgo,
} from "../../utils/date"
import Task, {TaskToggleIcon} from "./Task"
import * as Dialog from "@radix-ui/react-dialog"
import {useOutsideAlerter} from "../../utils/hooks"
import {useTasks} from "../../context"
import clsx from "clsx"
import {FaPlus} from "react-icons/fa6"
import {BsCalendar4Event} from "react-icons/bs"
import {IoCalendarOutline} from "react-icons/io5"
import {BsCalendar4Week} from "react-icons/bs"
import {LuCalendarRange} from "react-icons/lu"
import {IoCalendarClearOutline} from "react-icons/io5"

import type {IconType} from "react-icons"

function getDueDateDisplayStr(dueDate: string) {
  if (isDateSameAsToday(dueDate)) {
    return "Today"
  }

  if (areDatesSame(dueDate, getTomorrowDate())) {
    return "Tomorrow"
  }

  return formatDueDate(dueDate)
}

function DueDateInput({onSelect, dueDate}: {onSelect: (date: string) => void; dueDate: string}) {
  const [show, setShow] = React.useState(false)
  const [date, setDate] = React.useState("")

  function Item({
    title,
    Icon,
    children,
    onSelect,
    autoClose = true,
    action,
    info,
  }: {
    Icon: IconType
    title: string
    children?: React.ReactNode
    onSelect: () => void
    autoClose?: boolean
    action?: React.ReactNode
    info?: string
  }) {
    return (
      <>
        <button
          onClick={() => {
            onSelect()
            autoClose && setShow(false)
          }}
          className="text-sm w-full py-1 flex items-center gap-3 hover:bg-light-black px-3"
        >
          <Icon />
          <p className="">{title}</p>
          {children ? children : info ? <span className="inline-block ml-auto">{info}</span> : null}
        </button>
        {action}
      </>
    )
  }

  return (
    <div>
      <div className="flex items-center">
        <button
          className="w-full px-2 text-sm flex my-3 items-center gap-3 text-zinc-400"
          onClick={() => {
            setShow(state => !state)
          }}
        >
          <IoCalendarOutline />
          {dueDate ? <span>Due {getDueDateDisplayStr(dueDate)}</span> : <span>Add Due Date</span>}
        </button>

        {dueDate && (
          <button
            onClick={e => {
              e.stopPropagation()

              setShow(false)
              onSelect("")
            }}
            className="ml-auto"
          >
            <MdClose size={15} className="" />
          </button>
        )}
      </div>
      {show && (
        <div className="border border-zinc-700 rounded-md bg-dark-black p-1">
          <Item
            Icon={BsCalendar4Event}
            title="Today"
            onSelect={() => onSelect(getTodayDate())}
            info={getDayFromDate(getTodayDate())}
          />
          <Item
            Icon={BsCalendar4Week}
            title="Tomorrow"
            onSelect={() => onSelect(getTomorrowDate())}
            info={getDayFromDate(getTomorrowDate())}
          />
          <Item
            Icon={LuCalendarRange}
            title="Next Week"
            onSelect={() => onSelect(getComingMondayDate())}
            info={getDayFromDate(getComingMondayDate())}
          />
          <div className="h-[1px] bg-light-black m-[5px]" />
          <Item
            Icon={IoCalendarClearOutline}
            title="Pick a Date"
            onSelect={() => undefined}
            autoClose={false}
            action={
              <div className="flex gap-1 items-center justify-end px-3 py-1">
                <button className="bg-dark-black rounded-md px-2" onClick={() => setShow(false)}>
                  cancel
                </button>
                <button
                  className="rounded-md bg-blue-500 px-2"
                  onClick={() => {
                    setShow(false)

                    onSelect(date)
                  }}
                >
                  save
                </button>
              </div>
            }
          >
            <input
              type="date"
              placeholder="Pick a Date"
              className="bg-dark-black hover:bg-light-black"
              value={date}
              onChange={e => {
                setDate(e.target.value)
              }}
            />
          </Item>
        </div>
      )}
    </div>
  )
}

export default function Tasks() {
  const [task, setTask] = React.useState("")
  const {tasks, createTask, toggleTaskImportance, toggleTaskAddToMyDay} = useTasks()

  const [showSidebar, setShowSidebar] = React.useState<{show: boolean; taskId: TTask["id"] | null}>(
    {
      show: false,
      taskId: null,
    },
  )

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!task) return

    createTask(task, () => {
      setTask("")
    })
  }

  const selectedTask = tasks.find(t => t.id === showSidebar.taskId)

  const divRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="flex bg-dark-black w-full">
      <div className="w-full max-h-[100vh] relative">
        <div className="px-3">
          <div className="h-[8vh] flex items-center">
            <h1 className="text-2xl font-bold mt-4">Tasks</h1>
          </div>
          <div
            className="flex flex-col gap-[2px] custom-scrollbar scroll-smooth overflow-y-scroll h-[92vh]"
            ref={divRef}
          >
            {tasks.map(t => (
              <Task
                key={t.id}
                {...t}
                onToggleAddToMyDay={toggleTaskAddToMyDay}
                onToggleImportance={toggleTaskImportance}
                onClick={currentTask => setShowSidebar({taskId: currentTask.id, show: true})}
              />
            ))}
            <div className="min-h-[8vh]" />
          </div>
          <div className={clsx("absolute bottom-0 left-0 right-0 p-3 bg-dark-black")}>
            <form
              onSubmit={onSubmit}
              className="focus-within:ring-2 focus-within:ring-blue-500 rounded-md flex items-center w-full bg-mid-gray"
            >
              <FaPlus className="mx-3" />
              <input
                value={task}
                onChange={e => setTask(e.target.value)}
                className="outline-none w-full text-white rounded-md px-2 py-3 bg-mid-gray"
                placeholder="Add a Task"
              />
            </form>
          </div>
        </div>
      </div>
      {showSidebar.show && selectedTask && (
        <Drawer
          {...selectedTask}
          onDismiss={() => setShowSidebar({taskId: null, show: false})}
          ignoreRef={divRef}
        />
      )}
    </div>
  )
}

function Drawer({
  name,
  completed,
  // completed_on,
  created_at,
  id,
  onDismiss,
  ignoreRef,
  marked_today,
  due_date,
}: TTask & {
  onDismiss: () => void
  ignoreRef: React.RefObject<HTMLDivElement>
}) {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const modalRef = React.useRef<HTMLDivElement>(null)
  useOutsideAlerter(containerRef, {onClickOutside: onDismiss, ignore: [ignoreRef, modalRef]})

  const {
    toggleTaskCompleted: toggleTask,
    deleteTask,
    toggleTaskAddToMyDay,
    updateTaskDueDate,
  } = useTasks()

  return (
    <div
      className="border-l border-zinc-700 slide-in fixed right-0 h-screen max-w-xs z-10 min-w-72 max-h-[100vh] py-3 px-3 bg-dark-black"
      ref={containerRef}
    >
      <div className="h-[8vh] flex items-center">
        <div className="mt-3 flex items-center">
          <TaskToggleIcon completed={completed} onClick={() => toggleTask(id)} />
          <p>{name}</p>
        </div>
      </div>
      <AddToMyDay id={id} marked_today={marked_today} onToggleAddToMyDay={toggleTaskAddToMyDay} />
      <DueDateInput onSelect={dueDate => updateTaskDueDate(id, dueDate)} dueDate={due_date} />

      <div className="p-5 absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3">
        <button onClick={onDismiss}>
          <MdOutlineArrowForwardIos size={18} />
        </button>
        <p className="text-xs">Created {timeAgo(created_at)}</p>
        <button>
          <MdOutlineDeleteForever size={20} onClick={() => setShowDeleteModal(true)} />
        </button>
      </div>
      <DeleteTaskModel
        name={name}
        id={id}
        modalRef={modalRef}
        onDelete={id => {
          deleteTask(id)
          setShowDeleteModal(false)
        }}
        open={showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
      />
    </div>
  )
}
function AddToMyDay(props: {
  id: number
  onToggleAddToMyDay: (id: number) => void
  marked_today: string
}) {
  return (
    <button
      className={clsx(
        "border-y w-full py-3 border-light-black text-zinc-400 px-2 flex items-center gap-4 text-sm",
      )}
      onClick={e => {
        props.onToggleAddToMyDay(props.id)

        e.stopPropagation()
      }}
    >
      <MdSunny size={12} />
      <span>{isDateSameAsToday(props.marked_today) ? "Added to my day" : "Add to my day"}</span>
      {isDateSameAsToday(props.marked_today) && <MdClose size={12} className="ml-auto" />}
    </button>
  )
}

function DeleteTaskModel({
  name,
  id,
  onDelete,
  onDismiss,
  open,
  modalRef,
}: {
  open: boolean
  onDismiss: () => void
  name: string
  id: number
  onDelete: (id: number) => void
  modalRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onDismiss}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content bg-zinc-800">
          <Dialog.Title className="dialog-title text-center">Delete Task</Dialog.Title>
          <Dialog.Description className="font-bold dialog-description">{name}</Dialog.Description>
          <p className="text-sm mb-4">You won't be able to undo this action.</p>
          <div ref={modalRef} className="flex justify-center items-center gap-3">
            <Dialog.Close className="dialog-close">Cancel</Dialog.Close>
            <button
              className="border rounded-md px-3 py-1"
              type="button"
              onClick={() => onDelete(id)}
            >
              Delete Task
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
