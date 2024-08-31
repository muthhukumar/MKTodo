import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"

import clsx from "clsx"
import {MdOutlineArrowForwardIos, MdOutlineDeleteForever, MdSunny, MdClose} from "react-icons/md"

import {TTask} from "~/@types"
import {timeAgo, isDateSameAsToday} from "~/utils/date"
import {useDelay} from "~/utils/hooks"
import DueDateInput from "./DueDateInput"
import {TaskToggleIcon} from "./Task"
import {API} from "~/service"
import {useRouter} from "@tanstack/react-router"
import {AutoResizeTextarea, CopyToClipboardButton} from ".."
import {extractLinks} from "~/utils/url"
import {useAudioPlayer} from "~/utils/hooks"
import doneAudio from "~/assets/audio/ting.mp3"
import {handleError} from "~/utils/error"

export default function Drawer({
  name,
  completed,
  created_at,
  id,
  onDismiss,
  marked_today,
  due_date,
}: TTask & {
  onDismiss: () => void
  ignoreRef?: React.RefObject<HTMLDivElement>
}) {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const modalRef = React.useRef<HTMLDivElement>(null)

  const links = React.useMemo(() => extractLinks(name), [name])

  const router = useRouter()

  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const {togglePlay} = useAudioPlayer(doneAudio)

  async function updateTaskName(value: string) {
    if (name === value) return

    try {
      await API.updateTaskById({id: id, task: value})

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Updating task name failed"})
    }
  }

  async function toggleTaskAddToMyDay(id: number) {
    try {
      await API.toggleTaskAddToMyDayById(id)

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Adding task to My Day failed"})
    }
  }

  async function updateTaskDueDate(id: number, dueDate: string) {
    try {
      await API.updateTaskDueDateById(id, dueDate)

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Updating task Due Day failed"})
    }
  }

  async function deleteTask(id: number) {
    try {
      await API.deleteTaskById(id)

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Deleting task failed"})
    }
  }

  async function toggleTask(id: number) {
    if (!completed) togglePlay()

    try {
      await API.toggleTaskCompletedById(id)

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Toggling Task completion failed"})
    }
  }

  const [onFocusLeave] = useDelay(updateTaskName)
  const [onChange] = useDelay(updateTaskName, 3000)

  return (
    <div
      className="w-full border-l border-zinc-700 slide-in fixed right-0 h-screen md:max-w-xs z-50 min-w-72 max-h-[100vh] py-3 px-3 bg-background"
      ref={containerRef}
    >
      <div className="flex items-center w-full mb-3">
        <div className="mt-3 flex items-start w-full">
          <div className="flex-[0.1] flex items-center">
            <TaskToggleIcon completed={completed} onClick={() => toggleTask(id)} />
          </div>
          <div className="flex-[0.9] w-full">
            <AutoResizeTextarea
              ref={inputRef}
              className="w-full rounded-md bg-background outline-none"
              onBlur={e => onFocusLeave(e.target.value)}
              key={name}
              onChange={e => onChange(e.target.value)}
              defaultValue={name}
            />
          </div>
        </div>
      </div>
      <AddToMyDay id={id} markedToday={marked_today} onToggleAddToMyDay={toggleTaskAddToMyDay} />
      <DueDateInput onSelect={dueDate => updateTaskDueDate(id, dueDate)} dueDate={due_date} />
      {links.length > 0 && <Links links={links} />}

      <div className="p-5 absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onDismiss}>
            <MdOutlineArrowForwardIos size={18} />
          </button>
          <CopyToClipboardButton content={name} />
        </div>
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

function Links({links}: {links: Array<string>}) {
  return (
    <div className="border-border py-3 my-3 p-3 border rounded-md">
      <div className="flex flex-col gap-1">
        {links.map(link => {
          return (
            <div className="justify-between flex items-center gap-3">
              <a
                href={link}
                key={link}
                target="_blank"
                className="text-blue-400 truncate flex-[0.9]"
              >
                {link}
              </a>
              <div className="flex-[0.1]">
                <CopyToClipboardButton content={link} />
              </div>
            </div>
          )
        })}
      </div>
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
        "border-y w-full py-3 border-border text-zinc-400 px-2 flex items-center gap-4 text-sm",
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
        <Dialog.Content className="dialog-content border rounded-md border-border bg-background">
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
