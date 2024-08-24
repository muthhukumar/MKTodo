import * as React from "react"
import {useNavigate} from "@tanstack/react-router"
import {IoSearchOutline} from "react-icons/io5"
import {RiCloseCircleFill} from "react-icons/ri"
import {useDelay} from "~/utils/hooks"

export default function SearchBar() {
  const navigate = useNavigate({from: location.pathname})

  const [search, cancel] = useDelay((query: string) => {
    navigate({search: {query}})
  }, 1200)

  const inputRef = React.useRef<HTMLInputElement>(null)

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (inputRef.current) {
      cancel()
      navigate({search: {query: inputRef.current.value}})
    }
  }

  return (
    <form
      className="focus-within:ring-2 focus-within:ring-blue-500 px-4 md:px-1 flex items-center gap-3 border border-zinc-700 rounded-md bg-item-background"
      onSubmit={onSubmit}
    >
      <IoSearchOutline size={22} />
      <input
        ref={inputRef}
        className="outline-none text-sm rounded-md py-3 md:py-1 w-full bg-item-background"
        placeholder="Search"
        onChange={e => {
          search(e.target.value)
        }}
      />
      <button type="reset" onClick={() => navigate({to: location.pathname})}>
        <RiCloseCircleFill size={22} />
      </button>
    </form>
  )
}
