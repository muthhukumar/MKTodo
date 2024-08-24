import * as React from "react"
import {useNavigate} from "@tanstack/react-router"
import {IoSearchOutline} from "react-icons/io5"
import {RiCloseCircleFill} from "react-icons/ri"
import {useDelay} from "~/utils/hooks"
import {IoArrowBack} from "react-icons/io5"

export default function SearchBar() {
  const [showSearch, setShowSearch] = React.useState(false)

  const navigate = useNavigate({from: location.pathname})

  const [search] = useDelay((query: string) => {
    navigate({search: {query}})
  }, 1200)

  const url = new URL(window.location.href)

  const query = url.searchParams.get("query")

  React.useEffect(() => {
    function onScroll() {
      if (!query) {
        setShowSearch(false)
      }
    }

    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [query])

  return (
    <>
      <button onClick={() => setShowSearch(true)}>
        <IoSearchOutline size={20} />
      </button>
      {showSearch && (
        <div className="py-1 bg-background fixed top-2 w-[96%] mx-auto left-0 right-0">
          <form className="focus-within:ring-2 focus-within:ring-blue-500 px-4 md:px-1 flex items-center gap-3 border border-zinc-700 rounded-md bg-item-background">
            <button onClick={() => setShowSearch(false)}>
              <IoArrowBack size={20} />
            </button>
            <input
              autoFocus
              className="outline-none text-sm rounded-md py-2 md:py-1 w-full bg-item-background"
              placeholder="Search"
              onChange={e => {
                search(e.target.value)
              }}
            />
            <button
              type="reset"
              onClick={() => {
                navigate({to: location.pathname})
              }}
            >
              <RiCloseCircleFill size={22} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
