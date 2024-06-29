import {Link} from "@tanstack/react-router"

import {MdOutlineWbSunny} from "react-icons/md"
import {CiStar} from "react-icons/ci"
import {TbHomeCheck} from "react-icons/tb"
import {CiCalendarDate} from "react-icons/ci"
import clsx from "clsx"
import {IconType} from "react-icons"

function NavItem({Icon, title, path}: {title: string; path: string; Icon: IconType}) {
  const isActivePath = window.location.pathname.includes(path)

  return (
    <Link to={path} className={"flex-1 rounded-md flex flex-col items-center px-3 py-1"}>
      <div
        className={clsx("py-1 px-3 rounded-md mb-1", {
          "bg-tblue": isActivePath,
        })}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className={clsx("text-sm", {"text-tblue": isActivePath})}>{title}</p>
      </div>
    </Link>
  )
}

export default function MobileBottomNavbar() {
  return (
    <div className="px-1 h-[5%] bg-item-background flex items-center">
      <NavItem Icon={MdOutlineWbSunny} title="My Day" path="/tasks/my-day" />
      <NavItem Icon={CiStar} title="Important" path="/tasks/important" />
      <NavItem Icon={CiCalendarDate} title="Planned" path="/tasks/planned" />
      <NavItem Icon={TbHomeCheck} title="Tasks" path="/tasks/all" />
    </div>
  )
}
