import * as React from "react"

import {FaPlus} from "react-icons/fa6"
import {useOutsideAlerter} from "~/utils/hooks"
import {BsFillFileArrowUpFill} from "react-icons/bs"
import {handleError} from "~/utils/error"
import {useLists} from "~/utils/list/hooks"
import {useNavigate} from "@tanstack/react-router"
import {API} from "~/service"

const MobileCreateListInput = React.forwardRef(function MobileCreateTaskInput(_, ref) {
  const [showInput, setShowInput] = React.useState(false)
  const [listName, setListName] = React.useState("")

  const lists = useLists()

  const formRef = React.useRef<HTMLFormElement>(null)

  const navigate = useNavigate()

  function hideInput() {
    setShowInput(false)
  }

  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useImperativeHandle(ref, () => {
    return {
      focus: () => inputRef.current?.focus(),
    }
  })

  useOutsideAlerter(formRef, {onClickOutside: hideInput})

  async function createList() {
    if (listName.length < 3) return

    try {
      const {id} = await API.createList(listName)

      navigate({to: "/list/$listId/tasks", params: {listId: String(id)}})

      lists.invalidate()
      setShowInput(false)
    } catch (error) {
      handleError({error, defaultMessage: "Failed to create list"})
    } finally {
      setListName("")
    }
  }

  return (
    <>
      <div className="fixed bottom-20 right-3">
        {!showInput && (
          <button
            onClick={() => setShowInput(true)}
            className="p-3 rounded-full bg-tblue border border-border"
          >
            <FaPlus className="text-white" />
          </button>
        )}
      </div>
      {showInput && (
        <div>
          <form
            ref={formRef}
            onSubmit={e => {
              e.preventDefault()
              createList()
            }}
            className="bg-item-background border border-zinc-600 fixed bottom-0 left-0 right-0 w-[98%] mx-auto rounded-t-md z-50"
          >
            <div className="w-full flex items-center">
              <input
                ref={inputRef}
                value={listName}
                type="text"
                name="Task"
                autoFocus
                title="Task"
                onChange={e => setListName(e.target.value)}
                className="outline-none w-full text-white rounded-md px-2 py-3 bg-item-background"
                placeholder="Create a list"
              />
              <button
                type="submit"
                className="mr-3 flex items-center justify-center"
                onClick={() => {
                  inputRef.current?.focus()
                }}
              >
                <BsFillFileArrowUpFill size={30} className="ext-inherit text-white" />
              </button>
            </div>
            <div className="w-full h-[1px] bg-border my-1" />
            <div className="bg-item-background flex items-center p-1">
              <button
                type="button"
                className="ml-auto border px-3 py-1 border-border rounded-md"
                onClick={hideInput}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
})

export default MobileCreateListInput
