import * as React from "react"
import {CgOptions} from "react-icons/cg"
import {FaRegCheckCircle} from "react-icons/fa"
import {useRouter} from "@tanstack/react-router"
import Logout from "./Logout"
import toast from "react-hot-toast"
import {useFeature} from "~/feature-context"

export default function Options() {
  const [showOptions, setShowOptions] = React.useState(false)
  const {features, toggleFeature} = useFeature()

  const router = useRouter()

  const divRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const showCompletedTasksFeature = features.find(f => f.id === "ShowCompletedTasks")

  async function onToggleShowCompleted() {
    try {
      toggleFeature("ShowCompletedTasks")

      setTimeout(() => {
        router.invalidate()

        setShowOptions(false)
      }, 250)
    } catch {
      toast.error(`Changing option failed. Code: OP:44`)
    }
  }

  return (
    <>
      <button ref={buttonRef} onClick={() => setShowOptions(state => !state)}>
        <CgOptions size={20} className="text-gray-300" />
      </button>
      {showOptions && (
        <div
          ref={divRef}
          className="flex flex-col gap-2 py-3 px-4 bg-background absolute top-full max-w-sm right-0 border rounded-md border-border"
        >
          <button className="w-full flex items-center gap-2" onClick={onToggleShowCompleted}>
            <FaRegCheckCircle />
            <span>{showCompletedTasksFeature?.enable ? "Hide" : "Show"} Completed Tasks</span>
          </button>
          <Logout />
        </div>
      )}
    </>
  )
}
