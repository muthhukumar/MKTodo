import * as React from "react"
import {useOutsideAlerter} from "~/utils/hooks"
import {
  SelectedOptionsDisplay,
  SelectAllOption,
  CreateNewOptionButton,
  SelectOption,
} from "./components"
import {isEveryItemSelected} from "./utils"

interface SelectProps {
  label: string
  data: Array<string>
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>
  selectedOptions: Array<string>
}

export default function Select(props: SelectProps) {
  const [showOptions, setShowOptions] = React.useState(false)
  const [searchText, setSearchText] = React.useState("")

  const {label, data, selectedOptions, setSelectedOptions} = props

  const filteredData = searchText
    ? data.filter(option => option.toLowerCase().includes(searchText.toLowerCase()))
    : data

  function handleOptionToggle(item: SelectProps["data"][number]) {
    setSelectedOptions(oldOptions => {
      if (item === "all") {
        if (isEveryItemSelected(data, selectedOptions)) {
          return []
        }

        return [...data]
      }

      if (selectedOptions.includes(item)) {
        return oldOptions.filter(option => option !== item)
      }

      return [...oldOptions, item]
    })
  }

  const containerRef = React.useRef<HTMLDivElement>(null)

  useOutsideAlerter(containerRef, {onClickOutside: () => setShowOptions(false)})

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Create new tag if the search is empty
    if (filteredData.length === 0) {
      handleOptionToggle(searchText)

      return
    }

    // Toggle between top result
    if (filteredData.length === 1) {
      handleOptionToggle(searchText)
      return
    }
  }

  return (
    <div ref={containerRef}>
      <div className="relative border border-border p-3 rounded-md">
        <div className="flex items-center justify-between" onClick={() => setShowOptions(true)}>
          {!showOptions ? (
            <SelectedOptionsDisplay
              selectedOptions={selectedOptions}
              showOptions={showOptions}
              label={label}
            />
          ) : (
            <form onSubmit={handleSearchSubmit} className="w-full">
              <input
                type="text"
                className="w-full bg-background"
                value={searchText}
                onChange={e => setSearchText(e.target.value.trim())}
              />
            </form>
          )}
        </div>
        {showOptions && (
          <div className="flex flex-col absolute top-[110%] left-0 right-0 bg-black border border-border rounded-md p-3 gap-3 max-h-64 overflow-y-scroll">
            <SelectAllOption
              checked={isEveryItemSelected(data, selectedOptions)}
              onChange={() => handleOptionToggle("all")}
              onClose={() => setShowOptions(false)}
            />
            {filteredData.length === 0 && (
              <CreateNewOptionButton
                onClick={() => {
                  handleOptionToggle(searchText)
                  setSearchText("")
                }}
                text={searchText}
              />
            )}
            {filteredData.map(item => {
              return (
                <SelectOption
                  item={item}
                  onChange={() => handleOptionToggle(item)}
                  key={item}
                  checked={selectedOptions.includes(item)}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
