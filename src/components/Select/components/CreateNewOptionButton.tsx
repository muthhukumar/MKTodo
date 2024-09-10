import {MdOutlineAdd} from "react-icons/md"

interface CreateNewOptionButtonProps {
  onClick: (text: string) => void
  text: string
}

export default function CreateNewOptionButton(props: CreateNewOptionButtonProps) {
  return (
    <button
      className="flex items-center border border-border p-1 rounded-md w-full"
      onClick={() => props.onClick(props.text)}
    >
      <span className="ml-1 mr-2">
        <MdOutlineAdd size={20} />
      </span>
      <p>
        Create <strong>{props.text}</strong>
      </p>
    </button>
  )
}
