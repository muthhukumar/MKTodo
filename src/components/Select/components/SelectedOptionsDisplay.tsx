import {MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown} from "react-icons/md"

interface SelectedOptionsDisplayProps {
  selectedOptions: Array<any>
  label: string
  showOptions: boolean
}

export default function SelectedOptionsDisplay(props: SelectedOptionsDisplayProps) {
  return (
    <>
      {props.selectedOptions.length === 0 ? (
        <div className="flex items-center justify-between">
          <label className="top-1 left-3">Select {props.label}</label>
        </div>
      ) : (
        <div className="max-w-[90%] truncate">
          {props.selectedOptions.map((option, idx) => (
            <span key={option}>
              {option}
              {idx < props.selectedOptions.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}
      {props.showOptions ? (
        <MdOutlineKeyboardArrowUp size={24} />
      ) : (
        <MdOutlineKeyboardArrowDown size={24} />
      )}
    </>
  )
}
