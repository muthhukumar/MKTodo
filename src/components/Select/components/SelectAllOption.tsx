import {MdOutlineClose} from "react-icons/md"

interface SelectAllOptionProps {
  checked: boolean
  onChange: () => void
  onClose: () => void
}

export default function SelectAllOption(props: SelectAllOptionProps) {
  return (
    <div className="flex justify-between items-center gap-3 border-b border-border pb-3">
      <input
        type="checkbox"
        id="all"
        value="all"
        checked={props.checked}
        onChange={props.onChange}
      />
      <button onClick={props.onClose}>
        <MdOutlineClose />
      </button>
    </div>
  )
}
