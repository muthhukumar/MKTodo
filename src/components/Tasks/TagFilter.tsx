import * as React from "react"
import {IoArrowBack} from "react-icons/io5"
import {MdFilterList} from "react-icons/md"
import {Select} from ".."

function TagFilter({
  tags,
  selectedFilters,
  setSelectedFilters,
}: {
  tags: Array<string>
  selectedFilters: Array<string>
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const [showFilters, setShowFilters] = React.useState(false)

  return (
    <>
      <button onClick={() => setShowFilters(true)}>
        <MdFilterList size={20} />
      </button>
      {showFilters && (
        <div className="py-1 bg-background fixed top-2 w-[96%] mx-auto left-0 right-0">
          <div className="focus-within:ring-2 focus-within:ring-blue-500 px-4 md:px-1 flex items-center gap-3 border border-zinc-700 rounded-md bg-item-background">
            <button
              onClick={() => {
                setShowFilters(false)
                setSelectedFilters([])
              }}
            >
              <IoArrowBack size={20} />
            </button>
            <div className="w-full">
              <Select
                closeOnSelect
                showOptions
                data={tags}
                selectedOptions={selectedFilters}
                setSelectedOptions={setSelectedFilters}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TagFilter
