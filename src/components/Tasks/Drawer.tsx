import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"

import clsx from "clsx"
import {MdOutlineArrowForwardIos, MdOutlineDeleteForever, MdSunny, MdClose} from "react-icons/md"

import {TTask} from "../../@types"
import {useTasks} from "../../context"
import {timeAgo, isDateSameAsToday} from "../../utils/date"
import {useOutsideAlerter} from "../../utils/hooks"
import DueDateInput from "./DueDateInput"
import {TaskToggleIcon} from "./Task"

export default function Drawer({
  name,
  completed,
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
      <AddToMyDay id={id} markedToday={marked_today} onToggleAddToMyDay={toggleTaskAddToMyDay} />
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
  markedToday: string
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
      <span>{isDateSameAsToday(props.markedToday) ? "Added to my day" : "Add to my day"}</span>
      {isDateSameAsToday(props.markedToday) && <MdClose size={12} className="ml-auto" />}
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
