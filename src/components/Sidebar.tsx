import clsx from "clsx"
import {MdOutlineWbSunny} from "react-icons/md"
import {CiStar} from "react-icons/ci"
import {IconType} from "react-icons"
import {TbHomeCheck} from "react-icons/tb"
import {CiCalendarDate} from "react-icons/ci"
import {Link, useLocation, useNavigate} from "@tanstack/react-router"
import {twMerge} from "tailwind-merge"
import {useAuth} from "~/auth-context"
import toast from "react-hot-toast"
import {SearchBar} from "."
import {usePing} from "~/utils/hooks"

function IconLink({Icon, title, path}: {Icon: IconType; title: string; path: string}) {
  const isActivePath = window.location.pathname.includes(path)

  return (
    <Link
      to={path}
      className={clsx(
        "relative hover:cursor-pointer flex items-center hover:bg-hover-background px-1 py-1 rounded-md",
        {
          "bg-hover-background": isActivePath,
        },
      )}
    >
      <div className="flex-[0.1]">
        <Icon size={20} />
      </div>
      <div className="flex-[0.9]">
        <p className="text-lg md:text-sm">{title}</p>
      </div>
      {/* TODO - add the tasks count later here */}
      {/* {isActivePath && (
        <span className={clsx("delayed-element text-xs absolute right-3")}>{tasks?.length}</span>
      )} */}
    </Link>
  )
}

export default function Sidebar({className}: {className?: string}) {
  const location = useLocation()
  const navigate = useNavigate({from: location.pathname})
  const {logout} = useAuth()
  const online = usePing()

  function chooseDifferentServer() {
    toast.success("Logging out...")
    logout()

    setTimeout(() => {
      navigate({to: "/login"})
    }, 1200)
  }

  return (
    <div
      className={twMerge(
        "h-screen relative w-1/4 min-w-80 max-w-md py-6 md:py-8 bg-background border-r border-border",
        className,
      )}
    >
      <div className="px-3">
        <div className="hidden md:block">
          <SearchBar />
        </div>
        <div className="flex-col flex gap-2 md:mt-5">
          <IconLink Icon={MdOutlineWbSunny} title="My Day" path="/tasks/my-day" />
          <IconLink Icon={CiStar} title="Important" path="/tasks/important" />
          <IconLink Icon={CiCalendarDate} title="Planned" path="/tasks/planned" />
          <IconLink Icon={TbHomeCheck} title="Tasks" path="/tasks/all" />
        </div>
        <button
          className="text-lg md:text-base border border-border rounded-md px-3 py-2 w-full mt-5"
          onClick={chooseDifferentServer}
        >
          Choose different server
        </button>
        <p className="mt-4">{location.href}</p>
      </div>
      {online !== null && !online && (
        <p
          className={clsx(
            "w-fit mx-auto absolute left-0 right-0 bottom-0 mb-5 px-4 py-1 border border-border rounded-full text-center",
            {
              "text-green-400 border-green-400": online,
              "text-red-400 border-red-400": !online,
            },
          )}
        >
          {online ? "Online" : "Server is offline"}
        </p>
      )}
    </div>
  )
}
