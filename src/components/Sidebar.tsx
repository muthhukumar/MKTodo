import clsx from "clsx"
import {MdOutlineWbSunny} from "react-icons/md"
import {CiStar} from "react-icons/ci"
import {IconType} from "react-icons"
import {TbHomeCheck, TbSettings} from "react-icons/tb"
import {CiCalendarDate} from "react-icons/ci"
import {Link, useLocation} from "@tanstack/react-router"
import {twMerge} from "tailwind-merge"
import {Divider, FeatureFlag, SearchBar} from "."
import {useLists, usePing} from "~/utils/hooks"
import {MdOutlineChecklist} from "react-icons/md"

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
  const online = usePing()

  const lists = useLists()

  return (
    <div
      className={twMerge(
        "sticky h-screen left-0 top-0 bottom-0 w-1/4 min-w-80 max-w-md py-6 md:py-8 bg-background border-r border-border",
        className,
      )}
    >
      <div className="px-3">
        <div className="hidden md:block">
          <SearchBar />
        </div>
        <div className="flex-col flex gap-2 md:mt-5">
          <IconLink Icon={MdOutlineWbSunny} title="My Day" path="/tasks/my-day" />
          <FeatureFlag feature="ImportantTaskView">
            <FeatureFlag.Feature>
              <IconLink Icon={CiStar} title="Important" path="/tasks/important" />
            </FeatureFlag.Feature>
          </FeatureFlag>
          <IconLink Icon={CiCalendarDate} title="Planned" path="/tasks/planned" />
          <IconLink Icon={TbHomeCheck} title="Tasks" path="/tasks/all" />
          <IconLink Icon={TbSettings} title="Settings" path="/settings" />
        </div>
        <p className="mt-4">{location.href}</p>
      </div>
      <Divider />
      <div className="flex flex-col gap-2 px-5">
        {lists.map(l => {
          return (
            <Link
              to="/list/$listId/tasks"
              params={{listId: String(l.id)}}
              className="flex items-center gap-3"
            >
              <MdOutlineChecklist />
              <span className="text-sm">{l.name}</span>
            </Link>
          )
        })}
      </div>
      <p id="activeRequestCount"></p>
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
