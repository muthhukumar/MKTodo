import {MdOutlineArrowBackIos} from "react-icons/md"
import {useGoBack} from "~/utils/navigation"

function GoBack() {
  const goBack = useGoBack()

  return (
    <button
      onClick={goBack}
      className="left-6 fixed bottom-10 p-3 backdrop-blur-sm rounded-full bg-border flex items-center justify-center"
    >
      <MdOutlineArrowBackIos />
    </button>
  )
}

export default GoBack
