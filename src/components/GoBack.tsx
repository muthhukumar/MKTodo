import {MdOutlineArrowBackIos} from "react-icons/md"
import {useGoBack} from "~/utils/navigation"
import {ImHome} from "react-icons/im"
import {useRouter} from "@tanstack/react-router"

function GoBack() {
  const goBack = useGoBack()
  const router = useRouter()

  return (
    <>
      <button
        onClick={() =>
          router.navigate({
            to: "/tasks/$taskType",
            params: {taskType: "all"},
            search: {filter: "none"},
          })
        }
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
