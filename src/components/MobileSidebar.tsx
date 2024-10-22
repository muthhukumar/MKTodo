import * as React from "react"
import clsx from "clsx"
import {MdOutlineWbSunny} from "react-icons/md"
import {CiStar} from "react-icons/ci"
import {IconType} from "react-icons"
import {TbHomeCheck, TbSettings} from "react-icons/tb"
import {CiCalendarDate} from "react-icons/ci"
import {Link} from "@tanstack/react-router"
import {twMerge} from "tailwind-merge"
import {CreateListInput, Divider, FeatureFlag, SearchBar} from "."
import {MdOutlineChecklist} from "react-icons/md"
import {useLists} from "~/utils/list/hooks"
import {useOnSwipe} from "~/utils/hooks"

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

export default function MobileSidebar({className}: {className?: string}) {
  const {lists} = useLists()

  const [showSidebar, setShowSidebar] = React.useState(true)

  useOnSwipe(
    {
      enable: true, // TODO
      ranges: [
        {
          id: "swipe-to-sidebar",
          reverse: false,
          range: [1, 30],
          minDistancePercentage: 25,
          axis: "x",
          callback: () => setShowSidebar(true),
        },
      ],
    },
    [],
  )

  React.useEffect(() => {
    setShowSidebar(false)
  }, [location.href])

  if (!showSidebar) return null

  return (
    <div
      className={twMerge(
        "overflow-y-scroll no-scrollbar fixed max-h-[100vh] h-screen left-0 top-0 bottom-0 w-full py-6 md:py-8 bg-background border-r border-border right-0 z-40",
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
      </div>
      <Divider />
      <div className="flex flex-col gap-2 px-4">
        {lists.map(l => {
          return (
            <Link
              key={l.id}
              to="/list/$listId/tasks"
              params={{listId: String(l.id)}}
              className="flex items-center gap-5"
            >
              <MdOutlineChecklist />
              <span className="text-lg">{l.name}</span>
            </Link>
          )
        })}
      </div>
      <CreateListInput />
      <button
        className="absolute bottom-4 rounded-md border border-border px-3 mx-4 py-1 left-0 right-0 inline-block"
        onClick={() => setShowSidebar(false)}
      >
        Close
      </button>
    </div>
  )
}
