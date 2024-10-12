import {Link} from "@tanstack/react-router"
import {IoSearchOutline} from "react-icons/io5"

export default function SearchBar() {
  return (
    <Link
      className="py-1 flex focus-within:ring-2 focus-within:ring-blue-500 px-4 md:px-1 items-center gap-3 border border-zinc-700 rounded-md bg-item-background"
      to="/search"
      search={{
        query: "",
      }}
    >
      <IoSearchOutline size={22} />
      <p>Search</p>
    </Link>
  )
}
