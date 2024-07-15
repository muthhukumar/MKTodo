import {Link} from "@tanstack/react-router"

import {MdOutlineWbSunny} from "react-icons/md"
import {CiStar} from "react-icons/ci"
import {TbHomeCheck} from "react-icons/tb"
import {CiCalendarDate} from "react-icons/ci"
import clsx from "clsx"
import {IconType} from "react-icons"

function NavItem({Icon, path}: {title: string; path: string; Icon: IconType}) {
  const isActivePath = window.location.pathname.includes(path)

  return (
    <Link to={path} className={"flex-1 rounded-md flex flex-col items-center px-3 py-1"}>
      <div
        className={clsx("px-3 py-1 rounded-md mb-1", {
          "text-zinc-200": isActivePath,
          "text-zinc-500": !isActivePath,
        })}
      >
        <Icon size={24} />
      </div>
    </Link>
  )
}

export default function MobileBottomNavbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-1 bg-item-background border-t border-zinc-500 rounded-b-md z-10 flex items-center">
      <NavItem Icon={MdOutlineWbSunny} title="My Day" path="/tasks/my-day" />
      <NavItem Icon={CiStar} title="Important" path="/tasks/important" />
      <NavItem Icon={CiCalendarDate} title="Planned" path="/tasks/planned" />
      <NavItem Icon={TbHomeCheck} title="Tasks" path="/tasks/all" />
    </div>
  )
}
