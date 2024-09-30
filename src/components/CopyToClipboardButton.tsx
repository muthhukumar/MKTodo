import {writeText} from "@tauri-apps/plugin-clipboard-manager"
import {MdOutlineContentCopy} from "react-icons/md"
import toast from "react-hot-toast"

export default function CopyToClipboardButton({content}: {content: string}) {
  async function copy() {
    try {
      await writeText(content)
      toast.success("Copied to Clipboard!!")
    } catch (err) {
      toast.error("Copying text failed. Code: CCB:11")
    }
  }

  return (
    <button className="p-0 m-0" onClick={copy}>
      <MdOutlineContentCopy />
    </button>
  )
}
