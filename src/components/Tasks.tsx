import * as React from "react"

import {MdOutlineArrowForwardIos, MdOutlineDeleteForever} from "react-icons/md"
import {TTask} from "../@types"
import {timeAgo} from "../utils/date"
import Task, {TaskToggleIcon} from "./Task"
import * as Dialog from "@radix-ui/react-dialog"
import {useOutsideAlerter} from "../utils/hooks"
import {useTasks} from "../context"
import clsx from "clsx"

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
    <div className="flex bg-zinc-800 w-full">
      <div className="w-full max-h-[100vh] relative">
        <div className="px-3">
          <div className="h-[8vh] flex items-center">
            <h1 className="text-2xl font-bold mt-4">Tasks</h1>
          </div>
          <div
            className="flex flex-col gap-[2px] custom-scrollbar overflow-y-scroll h-[92vh]"
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
          <div className={clsx("absolute bottom-0 left-0 right-0 p-3 bg-zinc-800")}>
            <form onSubmit={onSubmit} className="w-full">
              <input
                value={task}
                onChange={e => setTask(e.target.value)}
                className="w-full bg-zinc-900 text-white rounded-md px-2 py-3"
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
}: TTask & {
  onDismiss: () => void
  ignoreRef: React.RefObject<HTMLDivElement>
}) {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const modalRef = React.useRef<HTMLDivElement>(null)
  useOutsideAlerter(containerRef, {onClickOutside: onDismiss, ignore: [ignoreRef, modalRef]})

  const {toggleTaskCompleted: toggleTask, deleteTask} = useTasks()

  return (
    <div
      className="border-l border-zinc-700 slide-in fixed right-0 h-screen max-w-xs z-10 min-w-72 max-h-[100vh] py-3 px-3 bg-zinc-800"
      ref={containerRef}
    >
      <div className="h-[8vh] flex items-center">
        <div className="mt-3 flex items-center">
          <TaskToggleIcon completed={completed} onClick={() => toggleTask(id)} />
          <p>{name}</p>
        </div>
      </div>
      <div className="p-5 absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3">
        <button onClick={onDismiss}>
          <MdOutlineArrowForwardIos size={18} />
        </button>
        <p className="text-xs">Created {timeAgo(created_at)} ago</p>
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
