import * as React from "react"
import {Link} from "@tanstack/react-router"
import {IoArrowBackSharp} from "react-icons/io5"

interface StandAlonePageProps {
  title: string
  goBackTo: string
  children: React.ReactNode
}

export default function StandAlonePage(props: StandAlonePageProps) {
  const {title, children, goBackTo} = props
  return (
    <div className="p-3">
      <div className="bg-background py-3 sticky top-0 left-0 right-0 flex items-center gap-3">
        <Link to={goBackTo}>
          <IoArrowBackSharp />
        </Link>
        <h3 className="ml-3 font-bold text-xl">Logs</h3>
      </div>
      {children}
    </div>
  )
}