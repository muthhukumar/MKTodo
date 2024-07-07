import * as React from "react"
import {CgOptions} from "react-icons/cg"
import {useOutsideAlerter} from "~/utils/hooks"
import {FaRegCheckCircle} from "react-icons/fa"
import {OptionsStore, OptionsType} from "~/utils/tauri-store"
import {useRouter} from "@tanstack/react-router"
import Logout from "./Logout"

export default function Options() {
  const [showOptions, setShowOptions] = React.useState(false)
  const [options, setOptions] = React.useState<OptionsType | null>(null)

  const router = useRouter()

  async function getOptions() {
    try {
      setOptions(await OptionsStore.get())
    } catch {
      setOptions(null)
    }
  }

  React.useEffect(() => {
    getOptions()
  }, [])

  const divRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  useOutsideAlerter(divRef, {onClickOutside: () => setShowOptions(false), ignore: [buttonRef]})

  function onToggleShowCompleted() {
    const showCompleted = options?.showCompleted === true ? true : false

    OptionsStore.set({key: "showCompleted", value: !showCompleted})
    OptionsStore.save()

    setTimeout(() => {
      router.invalidate()
      getOptions()

      setShowOptions(false)
    }, 750)
  }

  return (
    <>
      <button ref={buttonRef} onClick={() => setShowOptions(state => !state)}>
        <CgOptions size={18} className="text-gray-300" />
      </button>
      {showOptions && (
        <div
          ref={divRef}
          className="flex flex-col gap-2 py-3 px-4 bg-background absolute top-full max-w-sm right-0 border rounded-md border-border"
        >
          <button className="w-full flex items-center gap-2" onClick={onToggleShowCompleted}>
            <FaRegCheckCircle />
            <span>{options?.showCompleted === true ? "Hide" : "Show"} Completed Tasks</span>
          </button>
          <Logout />
        </div>
      )}
    </>
  )
}
