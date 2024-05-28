import * as React from "react"

import {MdOutlineArrowForwardIos, MdOutlineDeleteForever} from "react-icons/md"
import {TTask} from "../@types"
import {API} from "../service"
import {timeAgo} from "../utils/date"
import Task, {TaskToggleIcon} from "./Task"
import * as Dialog from "@radix-ui/react-dialog"
import {useOutsideAlerter} from "../utils/hooks"

export default function Tasks() {
  const [task, setTask] = React.useState("")
  const [tasks, setTasks] = React.useState<Array<TTask>>([])
  const [showSidebar, setShowSidebar] = React.useState<{show: boolean; taskId: TTask["id"] | null}>(
    {
      show: false,
      taskId: null,
    },
  )

  async function fetchData() {
    try {
      const tasks = await API.getTasks()

      setTasks(tasks)
    } catch (error) {
      console.log("failed to get tasks")
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!task) return

    try {
      await API.createTask({task})

      setTimeout(fetchData, 0)

      setTask("")
    } catch (error) {
      console.log("failed to create task")
    }
  }

  async function onDelete(id: number) {
    try {
      await API.deleteTaskById(id)

      setTimeout(fetchData, 0)
    } catch (error) {
      console.log("failed to delete task")
    }
  }

  async function onToggle(id: number) {
    try {
      await API.toggleTaskById(id)

      setTimeout(fetchData, 0)
    } catch (error) {
      console.log("failed to toggle task")
    }
  }

  const selectedTask = tasks.find(t => t.id === showSidebar.taskId)

  const divRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="flex bg-zinc-700 w-full">
      <div className="w-full max-h-[100vh] overflow-y-scroll relative">
        <div className="pl-5">
          <div className="h-[8vh] flex items-center">
            <h1 className="text-2xl font-bold mt-4">Tasks</h1>
          </div>
          <div className="flex flex-col gap-[2px] overflow-y-scroll h-[92vh]" ref={divRef}>
            {tasks.map(t => (
              <Task
                key={t.id}
                {...t}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={fetchData}
                onClick={currentTask => setShowSidebar({taskId: currentTask.id, show: true})}
              />
            ))}
            <div className="min-h-[8vh]" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-5 py-3 bg-zinc-700">
            <form onSubmit={onSubmit} className="w-full">
              <input
                value={task}
                onChange={e => setTask(e.target.value)}
                className="w-full bg-zinc-900 text-white rounded-md px-3 py-2"
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
          onToggle={onToggle}
          onDelete={onDelete}
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
  onDelete,
  onToggle,
  ignoreRef,
}: TTask & {
  onDismiss: () => void
  onDelete: (id: number) => void
  onToggle: (id: number) => void
  ignoreRef: React.RefObject<HTMLDivElement>
}) {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  useOutsideAlerter(containerRef, {onClickOutside: onDismiss, ignore: [ignoreRef]})

  return (
    <div
      className="slide-in fixed right-0 h-screen max-w-xs z-10 min-w-72 max-h-[100vh] py-3 px-3 bg-zinc-800"
      ref={containerRef}
    >
      <div className="h-[8vh] flex items-center">
        <div className="mt-3 flex items-center">
          <TaskToggleIcon completed={completed} onClick={() => onToggle(id)} />
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
        onDelete={id => {
          onDelete(id)
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
}: {
  open: boolean
  onDismiss: () => void
  name: string
  id: number
  onDelete: (id: number) => void
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onDismiss}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content bg-zinc-800">
          <Dialog.Title className="dialog-title text-center">Delete Task</Dialog.Title>
          <Dialog.Description className="font-bold dialog-description">{name}</Dialog.Description>
          <p className="text-sm mb-4">You won't be able to undo this action.</p>
          <div className="flex justify-center items-center gap-3">
            <Dialog.Close className="dialog-close">Cancel</Dialog.Close>
            <button className="border rounded-md px-3 py-1" onClick={() => onDelete(id)}>
              Delete Task
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
