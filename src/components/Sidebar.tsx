import clsx from "clsx"
import {MdOutlineWbSunny} from "react-icons/md"
import {CiStar} from "react-icons/ci"
import {IconType} from "react-icons"
import {TbHomeCheck} from "react-icons/tb"
import {CiCalendarDate} from "react-icons/ci"
import {RiCloseCircleFill} from "react-icons/ri"
import {IoSearchOutline} from "react-icons/io5"
import {APIStore} from "~/utils/tauri-store"
import {Link, useLocation, useNavigate} from "@tanstack/react-router"
import {useDelay} from "~/utils/hooks"

function IconLink({Icon, title, path}: {Icon: IconType; title: string; path: string}) {
  const isActivePath = window.location.pathname === path

  return (
    <Link
      to={path}
      className={clsx(
        "relative hover:cursor-pointer flex items-center hover:bg-highlight-black px-1 py-1 rounded-md",
        {
          "bg-highlight-black": isActivePath,
        },
      )}
    >
      <div className="flex-[0.1]">
        <Icon size={20} />
      </div>
      <div className="flex-[0.9]">
        <p className="text-sm">{title}</p>
      </div>
      {/* TODO - add the tasks count later here */}
      {/* {isActivePath && (
        <span className={clsx("delayed-element text-xs absolute right-3")}>{tasks?.length}</span>
      )} */}
    </Link>
  )
}

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate({from: location.pathname})

  async function chooseDifferentServer() {
    try {
      await APIStore.reset()

      navigate({from: location.pathname, to: "/login"})
    } catch (error) {
      console.log("failed to choose different server", error)
    }
  }

  const search = useDelay((query: string) => {
    navigate({search: {query}})
  }, 1200)

  return (
    <div className="h-screen relative w-1/4 max-w-md py-8 bg-mid-black border-r-2 border-blak">
      <div className="px-3">
        <form className="focus-within:ring-2 focus-within:ring-blue-500 px-1 flex items-center gap-3 border border-zinc-700 rounded-md  bg-light-black">
          <IoSearchOutline size={22} />
          <input
            className="outline-none text-sm rounded-md py-1 w-full bg-light-black"
            placeholder="Search"
            onChange={e => {
              search(e.target.value)
            }}
          />
          {/* TODO - clicking this is not resetting the value */}
          <button type="reset" onClick={() => navigate({to: location.pathname})}>
            <RiCloseCircleFill size={22} />
          </button>
        </form>
        <div className="flex-col flex gap-2 mt-5">
          <IconLink Icon={MdOutlineWbSunny} title="My Day" path="/my-day" />
          <IconLink Icon={CiStar} title="Important" path="/important" />
          <IconLink Icon={CiCalendarDate} title="Planned" path="/planned" />
          <IconLink Icon={TbHomeCheck} title="Tasks" path="/" />
        </div>
        <button
          className="border border-light-black rounded-md px-3 py-2 w-full mt-5"
          onClick={chooseDifferentServer}
        >
          Choose different server
        </button>

        <p className="mt-4">{location.href}</p>

        {/* <LastSynced /> */}
      </div>
    </div>
  )
}

// function LastSynced() {
//   const {syncStatus, loading} = useTasks()
//   const isLoading = useDelayedLoading({waitFor: 600, loading})

//   if (!syncStatus) return

//   return (
//     <div className="absolute bottom-1 left-0 right-0 my-2 text-sm">
//       {!isLoading ? (
//         <p
//           className={clsx("text-zinc-400 text-center", {
//             "text-red-600": !syncStatus.success,
//           })}
//         >
//           Last synced {timeAgo(syncStatus.lastSyncedAt)}
//         </p>
//       ) : (
//         <Spinner />
//       )}
//     </div>
//   )
// }
