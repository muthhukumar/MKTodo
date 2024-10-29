import {useNavigate} from "@tanstack/react-router"
import * as React from "react"
import {FaPlus} from "react-icons/fa6"
import {API} from "~/service"
import {handleError} from "~/utils/error"
import {useLists} from "~/utils/list/hooks"

export default function CreateListInput() {
  const [showInput, setShowInput] = React.useState(false)

  const lists = useLists()

  const navigate = useNavigate()

  const inputRef = React.useRef<HTMLInputElement>(null)

  async function createList(listName: string) {
    if (listName.length < 3) return

    try {
      const {id} = await API.createList(listName)

      navigate({to: "/list/$listId/tasks", params: {listId: String(id)}})

      lists.invalidate()
      setShowInput(false)
    } catch (error) {
      handleError({error, defaultMessage: "Failed to create list"})
    }
  }

  return (
    <form
      className="px-4 md:text-sm mt-5 text-zinc-400"
      onSubmit={e => {
        e.preventDefault()

        createList(inputRef.current?.value || "")
      }}
    >
      {!showInput ? (
        <button
          type="button"
          onClick={() => setShowInput(true)}
          className="flex items-center gap-5"
        >
          <FaPlus />
          <span>New List</span>
        </button>
      ) : (
        <input
          ref={inputRef}
          className="py-3 w-full bg-inherit border border-border rounded-md text-white px-3"
          autoFocus
          onBlur={() => setShowInput(false)}
          placeholder="List name"
        />
      )}
    </form>
  )
}
