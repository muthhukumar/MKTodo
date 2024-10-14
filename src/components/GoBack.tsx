import {MdOutlineArrowBackIos} from "react-icons/md"
import {useGoBack} from "~/utils/navigation"
import {ImHome} from "react-icons/im"

function GoBack() {
  const goBack = useGoBack()

  return (
    <>
      <button
        onClick={goBack}
        className="left-6 fixed bottom-28 p-3 backdrop-blur-sm rounded-full bg-border flex items-center justify-center"
      >
        <ImHome />
      </button>
      <button
        onClick={goBack}
        className="left-6 fixed bottom-10 p-3 backdrop-blur-sm rounded-full bg-border flex items-center justify-center"
      >
        <MdOutlineArrowBackIos />
      </button>
    </>
  )
}

export default GoBack
