import * as React from "react"

import {TTask} from "../../@types"
import Task from "./Task"
import {useTasks} from "../../context"
import clsx from "clsx"
import {FaPlus} from "react-icons/fa6"
import Drawer from "./Drawer"

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
